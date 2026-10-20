#!/usr/bin/env python3
"""
Automated video compression and web-optimization script for Grupo AAA.
Downscales to max 1080p, compresses bitrate using H.264/CRF, strips audio,
and moves moov atom to the front (+faststart) for instant web streaming.
"""
import sys
import os
import subprocess

def get_ffmpeg():
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        pass

    for candidate in ["ffmpeg", "/opt/homebrew/bin/ffmpeg", "/usr/local/bin/ffmpeg", "/usr/bin/ffmpeg"]:
        try:
            res = subprocess.run([candidate, "-version"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            if res.returncode == 0:
                return candidate
        except Exception:
            continue
    return None

def compress_video(input_path, output_path):
    ffmpeg = get_ffmpeg()
    if not ffmpeg:
        print("ERROR: ffmpeg not found on system", file=sys.stderr)
        return False

    cmd = [
        ffmpeg,
        "-y",
        "-i", input_path,
        "-vf", "scale=min(1280\\,iw):-2",
        "-c:v", "libx264",
        "-profile:v", "main",
        "-level", "3.1",
        "-pix_fmt", "yuv420p",
        "-crf", "28",
        "-preset", "fast",
        "-b:v", "800k",
        "-maxrate", "1000k",
        "-bufsize", "1800k",
        "-an",
        "-movflags", "+faststart",
        output_path
    ]

    try:
        res = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, timeout=120)
        if res.returncode == 0 and os.path.exists(output_path) and os.path.getsize(output_path) > 0:
            orig_size = os.path.getsize(input_path)
            new_size = os.path.getsize(output_path)
            ratio = (1 - (new_size / orig_size)) * 100 if orig_size > 0 else 0
            print(f"SUCCESS: Compressed {orig_size} bytes -> {new_size} bytes ({ratio:.1f}% reduction)")
            return True
        else:
            print(f"ERROR: ffmpeg exited with code {res.returncode}: {res.stderr.decode('utf-8', errors='ignore')[-500:]}", file=sys.stderr)
            return False
    except Exception as e:
        print(f"ERROR: Video compression failed: {e}", file=sys.stderr)
        return False

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 compress_video.py <input_file> <output_file>", file=sys.stderr)
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]

    if not os.path.exists(input_file):
        print(f"ERROR: Input file not found: {input_file}", file=sys.stderr)
        sys.exit(1)

    ok = compress_video(input_file, output_file)
    sys.exit(0 if ok else 1)
