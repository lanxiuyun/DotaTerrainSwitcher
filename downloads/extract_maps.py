#!/usr/bin/env python3
"""
将downloads目录中的7z地图文件解压到src-tauri/resources目录
解压密码: terrain
"""

import os
import re
import subprocess
import sys
from pathlib import Path

# 配置 - 基于脚本所在位置计算路径
SCRIPT_DIR = Path(__file__).parent
DOWNLOADS_DIR = SCRIPT_DIR  # 脚本在downloads目录中
RESOURCES_DIR = SCRIPT_DIR.parent / "src-tauri/resources"
PASSWORD = "terrain"


def find_7z_executable() -> str:
    """查找7z可执行文件"""
    # 常见的7z安装路径
    possible_paths = [
        r"C:\Program Files\7-Zip\7z.exe",
        r"C:\Program Files (x86)\7-Zip\7z.exe",
    ]

    for path in possible_paths:
        if os.path.isfile(path):
            return path

    # 如果在PATH中，使用where命令查找
    try:
        result = subprocess.run(
            ["where", "7z"],
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore"
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout.strip().split("\n")[0].strip()
    except Exception:
        pass

    return None


def extract_7z(archive_path: Path, output_dir: Path, password: str, seven_zip_path: str) -> bool:
    """
    使用7z命令行工具解压文件

    Args:
        archive_path: 7z文件路径
        output_dir: 解压目标目录
        password: 解压密码
        seven_zip_path: 7z可执行文件路径

    Returns:
        是否成功解压
    """
    # 确保输出目录存在
    output_dir.mkdir(parents=True, exist_ok=True)

    # 构建7z命令
    # -y: 自动回答yes
    # -p: 密码
    # -o: 输出目录（注意：-o后面直接跟路径，没有空格）
    # 使用绝对路径确保7z能找到文件
    cmd = [
        seven_zip_path,
        "x",  # 完整路径解压
        str(archive_path.absolute()),
        f"-p{password}",
        f"-o{output_dir.absolute()}",
        "-y",  # 自动确认覆盖
    ]

    try:
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="ignore"
        )

        if result.returncode == 0:
            print(f"  ✓ 成功解压: {archive_path.name}")
            return True
        else:
            print(f"  ✗ 解压失败: {archive_path.name}")
            if result.stderr:
                print(f"    错误: {result.stderr[:200]}")
            return False

    except Exception as e:
        print(f"  ✗ 解压异常: {archive_path.name}")
        print(f"    错误: {e}")
        return False


def main():
    """主函数"""
    print("=" * 50)
    print("Dota2 地图文件解压工具")
    print("=" * 50)

    # 检查resources父目录是否存在（确保在项目结构中）
    if not SCRIPT_DIR.parent.exists():
        print(f"错误: 无法找到项目根目录")
        sys.exit(1)

    RESOURCES_DIR.mkdir(parents=True, exist_ok=True)

    # 查找7z工具
    seven_zip = find_7z_executable()
    if not seven_zip:
        print("错误: 未找到7z.exe，请确保已安装7-Zip")
        print("可从 https://www.7-zip.org/ 下载安装")
        sys.exit(1)

    print(f"使用7z工具: {seven_zip}")
    print(f"解压密码: {PASSWORD}")
    print(f"目标目录: {RESOURCES_DIR.absolute()}")
    print("-" * 50)

    # 查找所有7z文件（当前目录）
    seven_z_files = list(SCRIPT_DIR.glob("*.7z"))

    if not seven_z_files:
        print(f"在 {SCRIPT_DIR} 中未找到.7z文件")
        sys.exit(0)

    print(f"找到 {len(seven_z_files)} 个7z文件")
    print()

    # 解压统计
    success_count = 0
    fail_count = 0

    for archive in sorted(seven_z_files):
        # 从文件名获取地图名称，去掉末尾的版本号（_数字）
        # 例如: dota_winter_741.7z -> dota_winter, dota_winter_740 -> dota_winter
        map_name = re.sub(r'_\d+$', '', archive.stem)
        target_dir = RESOURCES_DIR / map_name

        print(f"[{success_count + fail_count + 1}/{len(seven_z_files)}] {archive.name}")
        print(f"  解压到: {target_dir}")

        # 检查目标目录是否已存在且有内容（可能已解压过）
        if target_dir.exists() and any(target_dir.iterdir()):
            print(f"  ⚠ 目标目录已存在且非空，跳过解压")
            print(f"    如需重新解压，请手动删除: {target_dir}")
            success_count += 1
            print()
            continue

        if extract_7z(archive, target_dir, PASSWORD, seven_zip):
            success_count += 1
        else:
            fail_count += 1

        print()

    # 统计结果
    print("=" * 50)
    print("解压完成!")
    print(f"  成功: {success_count}")
    print(f"  失败: {fail_count}")
    print("=" * 50)

    if fail_count > 0:
        sys.exit(1)


if __name__ == "__main__":
    main()
