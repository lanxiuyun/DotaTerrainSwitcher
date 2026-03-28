#!/usr/bin/env python3
"""
Dota 2 地图文件下载脚本
从 sharemods.com 下载各种 Dota 2 地图皮肤文件
使用 curl 命令，和 BAT 脚本行为完全一致
"""

import os
import re
import sys
import time
import subprocess
from pathlib import Path
from typing import List, Dict, Optional


# 地图文件列表
MAPS: List[Dict[str, str]] = [
    {"url": "https://sharemods.com/6wb1zgw0vcgy/dota_desert_741.7z.html", "id": "6wb1zgw0vcgy", "name": "dota_desert_741.7z"},
    {"url": "https://sharemods.com/ujt8q3waycv5/dota_coloseum_741.7z.html", "id": "ujt8q3waycv5", "name": "dota_coloseum_741.7z"},
    {"url": "https://sharemods.com/i4gd5qicyq1s/dota_reef_741.7z.html", "id": "i4gd5qicyq1s", "name": "dota_reef_741.7z"},
    {"url": "https://sharemods.com/4p593kcbvoow/dota_cavern_741.7z.html", "id": "4p593kcbvoow", "name": "dota_cavern_741.7z"},
    {"url": "https://sharemods.com/jgh8clxgi7kl/dota_jungle_741.7z.html", "id": "jgh8clxgi7kl", "name": "dota_jungle_741.7z"},
    {"url": "https://sharemods.com/tp8vsekecsa1/dota_ti10_741.7z.html", "id": "tp8vsekecsa1", "name": "dota_ti10_741.7z"},
    {"url": "https://sharemods.com/9n57hx2vukez/dota_crownfall_741.7z.html", "id": "9n57hx2vukez", "name": "dota_crownfall_741.7z"},
    {"url": "https://sharemods.com/tvpxlnpynzt7/dota_journey_741.7z.html", "id": "tvpxlnpynzt7", "name": "dota_journey_741.7z"},
    {"url": "https://sharemods.com/1agg1q3wa7l6/dota_winter_741.7z.html", "id": "1agg1q3wa7l6", "name": "dota_winter_741.7z"},
    {"url": "https://sharemods.com/xm0zga9k3gv7/dota_spring_741.7z.html", "id": "xm0zga9k3gv7", "name": "dota_spring_741.7z"},
    {"url": "https://sharemods.com/cccsb05lz5l4/dota_summer_741.7z.html", "id": "cccsb05lz5l4", "name": "dota_summer_741.7z"},
    {"url": "https://sharemods.com/qhdk8dg9x9cc/dota_autumn_741.7z.html", "id": "qhdk8dg9x9cc", "name": "dota_autumn_741.7z"},
]

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
DOWNLOAD_TIMEOUT = 300  # 5分钟
STEP_TIMEOUT = 30  # 30秒


class MapDownloader:
    def __init__(self, download_dir: Path, max_workers: int = 3):
        self.download_dir = download_dir
        self.max_workers = max_workers

    def extract_download_url(self, html_content: str) -> Optional[str]:
        """从 HTML 中提取真实的下载链接 - 完全复制BAT逻辑"""
        # 查找包含 smdl 和 r2.cloudflarestorage.com 的行
        lines = html_content.split('\n')
        for line in lines:
            if 'smdl' in line and 'r2.cloudflarestorage.com' in line:
                # 查找双引号中的URL（模拟BAT: for /f tokens=2 delims=")
                url_match = re.search(r'"(https://smdl[^"]+\.r2\.cloudflarestorage\.com[^"]*)"', line)
                if url_match:
                    return url_match.group(1)
        return None

    def get_download_url_with_curl(self, map_info: Dict[str, str]) -> Optional[str]:
        """使用curl获取下载链接 - 和BAT脚本完全一致"""
        url = map_info["url"]
        file_id = map_info["id"]
        temp_html = self.download_dir / "temp_step2.html"

        # 构造curl命令，和BAT完全一致
        # curl -s -L -A "USER_AGENT" -X POST -d "..." "url" -o "temp.html" --max-time 30
        post_data = f"op=download2&id={file_id}&rand=&referer=&method_free=&method_premium="

        curl_cmd = [
            "curl",
            "-s",  # 静默模式
            "-L",  # 跟随重定向
            "-A", USER_AGENT,  # User-Agent
            "-X", "POST",  # POST请求
            "-d", post_data,  # POST数据
            url,  # URL
            "-o", str(temp_html),  # 输出文件
            "--max-time", str(STEP_TIMEOUT),  # 超时时间
        ]

        try:
            # 执行curl命令
            result = subprocess.run(curl_cmd, capture_output=True, text=True, encoding='utf-8', errors='ignore')

            if result.returncode != 0:
                print(f"  [错误] curl执行失败: {result.stderr}")
                return None

            # 读取HTML内容
            if not temp_html.exists():
                return None

            html_content = temp_html.read_text(encoding='utf-8', errors='ignore')

            # 提取下载链接
            download_url = self.extract_download_url(html_content)

            # 清理临时文件
            try:
                temp_html.unlink()
            except:
                pass

            return download_url

        except Exception as e:
            print(f"  [错误] 获取下载链接失败: {e}")
            return None

    def download_file_with_curl(self, url: str, output_path: Path) -> bool:
        """使用curl下载文件 - 带进度显示"""
        # curl -L -A "USER_AGENT" "url" -o "file" --max-time 300 -C -
        curl_cmd = [
            "curl",
            "-L",  # 跟随重定向
            "-A", USER_AGENT,  # User-Agent
            "-o", str(output_path),  # 输出文件
            "--max-time", str(DOWNLOAD_TIMEOUT),  # 超时时间
            "-C", "-",  # 断点续传
            "-#",  # 显示进度条
            url,  # URL
        ]

        try:
            # 执行curl命令，实时输出进度
            result = subprocess.run(curl_cmd)
            return result.returncode == 0

        except Exception as e:
            print(f"\n  [错误] 下载失败: {e}")
            return False

    def download_map(self, map_info: Dict[str, str]) -> str:
        """下载单个地图文件"""
        output_file = self.download_dir / map_info["name"]

        # 检查文件是否已存在
        if output_file.exists():
            file_size = output_file.stat().st_size / (1024 * 1024)
            return f"跳过 {map_info['name']} - 文件已存在 ({file_size:.1f}MB)"

        print(f"下载: {map_info['name']}")

        # 获取真实下载链接（使用curl）
        download_url = self.get_download_url_with_curl(map_info)
        if not download_url:
            return f"失败 {map_info['name']} - 无法获取下载链接"

        print(f"  获取到下载链接，开始下载...")

        # 下载文件（使用curl）
        if self.download_file_with_curl(download_url, output_file):
            if output_file.exists():
                file_size = output_file.stat().st_size / (1024 * 1024)
                time.sleep(3)  # 下载间隔，避免被限流
                return f"完成 {map_info['name']} ({file_size:.1f}MB)"
            else:
                return f"失败 {map_info['name']} - 文件未创建"
        else:
            return f"失败 {map_info['name']} - 下载中断"

    def download_all(self):
        """下载所有地图文件"""
        print("=" * 60)
        print("Dota 2 地图文件下载工具")
        print("=" * 60)
        print(f"下载目录: {self.download_dir}")
        print("=" * 60)
        print()

        results = []

        # 顺序下载
        for map_info in MAPS:
            result = self.download_map(map_info)
            results.append(result)
            print(result)
            print()

        # 统计结果
        print()
        print("=" * 60)
        print("下载完成!")
        print("=" * 60)

        success_count = sum(1 for r in results if r.startswith("完成") or r.startswith("跳过"))
        fail_count = len(results) - success_count

        for result in results:
            icon = "✓" if result.startswith("完成") or result.startswith("跳过") else "✗"
            print(f"  {icon} {result}")

        print()
        print(f"总计: {len(results)} 个文件 | 成功: {success_count} | 失败: {fail_count}")


def main():
    # 获取脚本所在目录作为下载目录
    download_dir = Path(__file__).parent

    # 创建下载器实例
    downloader = MapDownloader(download_dir, max_workers=3)
    downloader.download_all()


if __name__ == "__main__":
    main()
