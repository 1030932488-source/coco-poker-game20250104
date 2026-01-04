import json

SCENE_PATH = r'd:\coco_poker\assets\scenes\GameScene.scene'
GAME_VIEW_TYPE = "aa25eyiPYtCuLsjnCXmXwxl"

def find_line():
    with open(SCENE_PATH, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    for i, line in enumerate(lines):
        if GAME_VIEW_TYPE in line:
            print(f"Found {GAME_VIEW_TYPE} at line {i+1}")
            # Print context
            print("Context:")
            start = max(0, i - 2)
            end = min(len(lines), i + 20)
            for j in range(start, end):
                print(f"{j+1}: {lines[j].strip()}")
            return

    print("GameView component type not found in text.")

if __name__ == '__main__':
    find_line()
