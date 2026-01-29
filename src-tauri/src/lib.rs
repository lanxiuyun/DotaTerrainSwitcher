use serde::{Deserialize, Serialize};
use std::{
    collections::{HashMap, HashSet},
    fs,
    path::{Path, PathBuf},
    process::Command,
    time::{SystemTime, UNIX_EPOCH},
};
use tauri::Manager;
#[cfg(target_os = "windows")]
use winreg::{enums::HKEY_LOCAL_MACHINE, RegKey};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
struct AliasApplyConfig {
    language_path: String,
    dota_path: Option<String>,
    heroes: HashMap<String, Vec<String>>,
}

#[derive(Debug, Serialize, Clone, Copy)]
#[serde(rename_all = "lowercase")]
enum LogLevel {
    Info,
    Warn,
    Error,
}

#[derive(Debug, Serialize)]
struct LogItem {
    level: LogLevel,
    message: String,
}

#[derive(Debug, Serialize)]
struct ApplyResult {
    logs: Vec<LogItem>,
}

struct TempDirGuard {
    path: PathBuf,
}

impl TempDirGuard {
    fn new(prefix: &str) -> Result<Self, String> {
        let base = std::env::temp_dir();
        let now = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map_err(|e| format!("无法获取系统时间: {e}"))?
            .as_millis();
        let dir = base.join(format!("{prefix}-{now}"));
        fs::create_dir_all(&dir).map_err(|e| format!("创建临时目录失败: {e}"))?;
        Ok(Self { path: dir })
    }

    fn path(&self) -> &Path {
        &self.path
    }
}

impl Drop for TempDirGuard {
    fn drop(&mut self) {
        let result = fs::remove_dir_all(&self.path);
        if result.is_err() {
            // best-effort cleanup
        }
    }
}

#[cfg(target_os = "windows")]
fn read_steam_install_path_from_registry() -> Option<PathBuf> {
    let key_path = r"SOFTWARE\WOW6432Node\Valve\Steam";
    let hklm = RegKey::predef(HKEY_LOCAL_MACHINE);
    let key = hklm.open_subkey(key_path).ok()?;
    let path: String = key.get_value("InstallPath").ok()?;
    let trimmed = path.trim();
    if trimmed.is_empty() {
        None
    } else {
        Some(PathBuf::from(trimmed))
    }
}

#[cfg(target_os = "windows")]
fn read_default_steam_path_from_env() -> Option<PathBuf> {
    let program_files_x86 = std::env::var("PROGRAMFILES(X86)").ok();
    let program_files = std::env::var("PROGRAMFILES").ok();
    let candidates = [program_files_x86, program_files];

    for base in candidates.into_iter().flatten() {
        let path = PathBuf::from(base).join("Steam");
        if path.exists() {
            return Some(path);
        }
    }

    None
}

#[cfg(target_os = "windows")]
fn extract_library_paths_from_vdf(content: &str) -> Vec<PathBuf> {
    let mut paths = Vec::<PathBuf>::new();
    for line in content.lines() {
        let trimmed = line.trim();
        if !trimmed.starts_with("\"path\"") {
            continue;
        }
        let parts: Vec<&str> = trimmed.split('"').collect();
        if parts.len() >= 4 {
            let raw = parts[3].replace("\\\\", "\\");
            if !raw.is_empty() {
                paths.push(PathBuf::from(raw));
            }
        }
    }
    paths
}

#[cfg(target_os = "windows")]
fn collect_steam_library_paths(steam_path: &Path) -> Vec<PathBuf> {
    let config_path = steam_path.join("steamapps").join("libraryfolders.vdf");
    let content = fs::read_to_string(config_path).unwrap_or_default();
    extract_library_paths_from_vdf(&content)
}

#[cfg(target_os = "windows")]
fn build_dota_candidate_paths(steam_roots: Vec<PathBuf>) -> Vec<PathBuf> {
    let mut candidates = Vec::<PathBuf>::new();
    for root in steam_roots {
        candidates.push(root.join("steamapps").join("common").join("dota 2 beta"));
        candidates.push(root.join("SteamApps").join("common").join("dota 2 beta"));
    }
    candidates
}

#[cfg(target_os = "windows")]
fn detect_dota_installation_path() -> Option<PathBuf> {
    let mut steam_roots = Vec::<PathBuf>::new();
    if let Some(path) = read_steam_install_path_from_registry() {
        steam_roots.push(path);
    } else if let Some(path) = read_default_steam_path_from_env() {
        steam_roots.push(path);
    }

    if let Some(steam_root) = steam_roots.get(0) {
        let extra_paths = collect_steam_library_paths(steam_root);
        steam_roots.extend(extra_paths);
    }

    let candidates = build_dota_candidate_paths(steam_roots);
    for path in candidates {
        if path.join("game").join("dota").exists() {
            return Some(path);
        }
    }

    None
}

#[cfg(not(target_os = "windows"))]
fn detect_dota_installation_path() -> Option<PathBuf> {
    None
}

fn find_existing_executable(candidates: Vec<PathBuf>) -> Option<PathBuf> {
    for path in candidates {
        if path.exists() {
            return Some(path);
        }
    }
    None
}

fn normalize_hero_key(input: &str) -> String {
    let trimmed = input.trim();
    if trimmed.starts_with("npc_dota_hero_") {
        return trimmed.trim_start_matches("npc_dota_hero_").to_string();
    }
    trimmed.to_string()
}

fn split_existing_aliases(raw: &str) -> Vec<String> {
    raw.split([',', ';'])
        .map(|v| v.trim())
        .filter(|v| !v.is_empty())
        .map(|v| v.to_string())
        .collect()
}

fn merge_aliases(existing: Vec<String>, incoming: &[String]) -> Vec<String> {
    let mut seen = HashSet::<String>::new();
    let mut merged = Vec::<String>::new();

    for item in existing {
        let key = item.to_lowercase();
        if seen.insert(key) {
            merged.push(item);
        }
    }

    for item in incoming {
        let value = item.trim();
        if value.is_empty() {
            continue;
        }
        let key = value.to_lowercase();
        if seen.insert(key) {
            merged.push(value.to_string());
        }
    }

    merged
}

fn find_hero_section(lines: &[String], hero_key: &str) -> Option<(usize, usize)> {
    let start_needle = format!("\t\"npc_dota_hero_{hero_key}\"");
    let mut start_index: Option<usize> = None;

    for (index, line) in lines.iter().enumerate() {
        if line.starts_with(&start_needle) {
            start_index = Some(index);
            break;
        }
    }

    let start = start_index?;
    for index in (start + 1)..lines.len() {
        if lines[index].starts_with("\t}") {
            return Some((start, index));
        }
    }

    None
}

fn extract_quoted_value(line: &str) -> Option<String> {
    let parts: Vec<&str> = line.split('"').collect();
    if parts.len() >= 4 {
        return Some(parts[3].to_string());
    }
    None
}

fn push_log(logs: &mut Vec<LogItem>, level: LogLevel, message: impl Into<String>) {
    logs.push(LogItem {
        level,
        message: message.into(),
    });
}

fn update_hero_aliases(
    lines: &mut Vec<String>,
    hero_key: &str,
    incoming: &[String],
    logs: &mut Vec<LogItem>,
) {
    let section = find_hero_section(lines, hero_key);
    let Some((start, end)) = section else {
        push_log(logs, LogLevel::Warn, format!("跳过 {hero_key}: 未找到英雄段落"));
        return;
    };

    let mut alias_line_index: Option<usize> = None;
    let mut alias_found_count = 0usize;
    let mut existing = Vec::<String>::new();

    for index in start..=end {
        let trimmed = lines[index].trim_start();
        if !trimmed.starts_with("\"NameAliases\"") {
            continue;
        }

        alias_found_count += 1;
        alias_line_index = Some(index);

        if let Some(value) = extract_quoted_value(&lines[index]) {
            existing.extend(split_existing_aliases(&value));
        }
    }

    if alias_found_count > 1 {
        push_log(
            logs,
            LogLevel::Warn,
            format!("警告: {hero_key} 存在多个 NameAliases，已按最后一个覆盖"),
        );
    }

    let merged = merge_aliases(existing, incoming);
    let merged_text = merged.join(",");
    let new_line = format!("\t\t\"NameAliases\"\t\"{merged_text}\"\n");

    if let Some(index) = alias_line_index {
        lines[index] = new_line;
        return;
    }

    let insert_index = end;
    lines.insert(insert_index, new_line);
}

fn run_external_command(mut command: Command, logs: &mut Vec<LogItem>) -> Result<(), String> {
    push_log(logs, LogLevel::Info, format!("执行: {:?}", command));
    let output = command
        .output()
        .map_err(|e| format!("执行外部命令失败: {e}"))?;

    let stdout = String::from_utf8_lossy(&output.stdout).trim().to_string();
    let stderr = String::from_utf8_lossy(&output.stderr).trim().to_string();

    if !stdout.is_empty() {
        push_log(logs, LogLevel::Info, format!("stdout:\n{stdout}"));
    }
    if !stderr.is_empty() {
        push_log(logs, LogLevel::Warn, format!("stderr:\n{stderr}"));
    }

    if !output.status.success() {
        return Err(format!("外部命令退出码异常: {}", output.status));
    }

    Ok(())
}

fn read_npc_heroes_lines(file_path: &Path) -> Result<Vec<String>, String> {
    let content = fs::read_to_string(file_path).map_err(|e| format!("读取 npc_heroes.txt 失败: {e}"))?;
    Ok(content.lines().map(|line| format!("{line}\n")).collect())
}

fn write_npc_heroes_lines(file_path: &Path, lines: &[String]) -> Result<(), String> {
    let content = lines.concat();
    fs::write(file_path, content).map_err(|e| format!("写入 npc_heroes.txt 失败: {e}"))
}

fn build_resource_candidates(resource_dir: &Path, parts: &[&str]) -> Vec<PathBuf> {
    let mut direct = PathBuf::from(resource_dir);
    for part in parts {
        direct = direct.join(part);
    }

    let mut nested = PathBuf::from(resource_dir).join("resources");
    for part in parts {
        nested = nested.join(part);
    }

    vec![direct, nested]
}

#[tauri::command]
fn apply_hero_aliases(app: tauri::AppHandle, config: AliasApplyConfig) -> Result<ApplyResult, String> {
    let mut logs = Vec::<LogItem>::new();
    push_log(&mut logs, LogLevel::Info, "开始处理英雄别名...");

    if !cfg!(target_os = "windows") {
        return Err("该功能仅支持 Windows。".to_string());
    }

    let dota_path_text = config.dota_path.clone().unwrap_or_default();
    let dota_path = if dota_path_text.trim().is_empty() {
        let auto_path = detect_dota_installation_path().ok_or_else(|| {
            "未提供 Dota 2 安装目录，且自动识别失败，请在页面选择 Dota 2 文件夹".to_string()
        })?;
        push_log(
            &mut logs,
            LogLevel::Info,
            format!("自动识别到 Dota 2 目录: {}", auto_path.display()),
        );
        auto_path
    } else {
        PathBuf::from(dota_path_text.trim())
    };
    if !dota_path.exists() {
        return Err(format!("Dota 2 目录不存在: {}", dota_path.display()));
    }

    let vpk_path = dota_path.join("game").join("dota").join("pak01_dir.vpk");
    if !vpk_path.exists() {
        return Err(format!("未找到 pak01_dir.vpk: {}", vpk_path.display()));
    }

    let resource_dir = app
        .path()
        .resource_dir()
        .map_err(|e| format!("无法获取 resource_dir: {e}"))?;
    push_log(
        &mut logs,
        LogLevel::Info,
        format!("resource_dir: {}", resource_dir.display()),
    );

    let vrf_exe = find_existing_executable(vec![
        build_resource_candidates(&resource_dir, &["alias-tools", "vrf", "VRF.exe"])
            .into_iter()
            .next()
            .unwrap(),
        build_resource_candidates(&resource_dir, &["alias-tools", "vrf", "Source2Viewer-CLI.exe"])
            .into_iter()
            .next()
            .unwrap(),
        build_resource_candidates(&resource_dir, &["resources", "alias-tools", "vrf", "VRF.exe"])
            .into_iter()
            .next()
            .unwrap(),
        build_resource_candidates(
            &resource_dir,
            &["resources", "alias-tools", "vrf", "Source2Viewer-CLI.exe"],
        )
        .into_iter()
        .next()
        .unwrap(),
    ])
    .ok_or_else(|| {
        "未找到 VRF 可执行文件，请放到 src-tauri/resources/alias-tools/vrf/ 下（VRF.exe 或 Source2Viewer-CLI.exe）"
            .to_string()
    })?;

    let vpkedit_exe = find_existing_executable(vec![
        build_resource_candidates(&resource_dir, &["alias-tools", "vpkedit", "VPKEdit-cli.exe"])
            .into_iter()
            .next()
            .unwrap(),
        build_resource_candidates(&resource_dir, &["alias-tools", "vpkedit", "vpkeditcli.exe"])
            .into_iter()
            .next()
            .unwrap(),
        build_resource_candidates(
            &resource_dir,
            &["resources", "alias-tools", "vpkedit", "VPKEdit-cli.exe"],
        )
        .into_iter()
        .next()
        .unwrap(),
        build_resource_candidates(
            &resource_dir,
            &["resources", "alias-tools", "vpkedit", "vpkeditcli.exe"],
        )
        .into_iter()
        .next()
        .unwrap(),
    ])
    .ok_or_else(|| {
        "未找到 VPKEdit CLI 可执行文件，请放到 src-tauri/resources/alias-tools/vpkedit/ 下（VPKEdit-cli.exe 或 vpkeditcli.exe）"
            .to_string()
    })?;

    push_log(
        &mut logs,
        LogLevel::Info,
        format!("VRF: {}", vrf_exe.display()),
    );
    push_log(
        &mut logs,
        LogLevel::Info,
        format!("VPKEdit: {}", vpkedit_exe.display()),
    );

    let temp_dir = TempDirGuard::new("dota-alias").map_err(|e| e)?;
    let extract_dir = temp_dir.path().join("extract");
    let vpk_content_dir = temp_dir.path().join("vpk_content");
    fs::create_dir_all(&extract_dir).map_err(|e| format!("创建解包目录失败: {e}"))?;
    fs::create_dir_all(&vpk_content_dir).map_err(|e| format!("创建打包目录失败: {e}"))?;

    let target_file = "scripts/npc/npc_heroes.txt";
    let mut vrf_command = Command::new(&vrf_exe);
    vrf_command
        .arg("-i")
        .arg(&vpk_path)
        .arg("-o")
        .arg(&extract_dir)
        .arg("-f")
        .arg(target_file);
    run_external_command(vrf_command, &mut logs).map_err(|e| format!("{e}\n（提取 npc_heroes.txt 失败）"))?;

    let npc_path = extract_dir
        .join("scripts")
        .join("npc")
        .join("npc_heroes.txt");
    if !npc_path.exists() {
        return Err(format!(
            "解包后未找到 npc_heroes.txt: {}",
            npc_path.display()
        ));
    }

    let mut lines = read_npc_heroes_lines(&npc_path)?;
    for (hero, incoming) in config.heroes.iter() {
        let hero_key = normalize_hero_key(hero);
        update_hero_aliases(&mut lines, &hero_key, incoming, &mut logs);
    }
    write_npc_heroes_lines(&npc_path, &lines)?;

    let scripts_npc_dir = vpk_content_dir.join("scripts").join("npc");
    fs::create_dir_all(&scripts_npc_dir).map_err(|e| format!("创建 scripts/npc 目录失败: {e}"))?;
    let dst_npc = scripts_npc_dir.join("npc_heroes.txt");
    fs::copy(&npc_path, &dst_npc).map_err(|e| format!("复制修改后的 npc_heroes.txt 失败: {e}"))?;

    let output_vpk = temp_dir.path().join("pak02_dir.vpk");
    let mut vpkedit_command = Command::new(&vpkedit_exe);
    vpkedit_command
        .arg("--output")
        .arg(&output_vpk)
        .arg("--single-file")
        .arg(&vpk_content_dir);
    run_external_command(vpkedit_command, &mut logs).map_err(|e| format!("{e}\n（打包 VPK 失败）"))?;

    if !output_vpk.exists() {
        return Err(format!("未生成 pak02_dir.vpk: {}", output_vpk.display()));
    }

    let target_dir = dota_path.join("game").join(config.language_path.trim());
    fs::create_dir_all(&target_dir).map_err(|e| format!("创建目标语言目录失败: {e}"))?;
    let target_vpk = target_dir.join("pak02_dir.vpk");

    if target_vpk.exists() {
        let _ = fs::remove_file(&target_vpk);
    }

    fs::copy(&output_vpk, &target_vpk).map_err(|e| format!("复制 pak02_dir.vpk 到游戏目录失败: {e}"))?;
    push_log(
        &mut logs,
        LogLevel::Info,
        format!("完成: {}", target_vpk.display()),
    );

    Ok(ApplyResult { logs })
}

#[tauri::command]
fn detect_dota_path() -> Result<Option<String>, String> {
    if !cfg!(target_os = "windows") {
        return Ok(None);
    }
    let path = detect_dota_installation_path();
    Ok(path.map(|item| item.to_string_lossy().to_string()))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            apply_hero_aliases,
            detect_dota_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
