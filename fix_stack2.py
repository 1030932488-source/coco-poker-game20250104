# -*- coding: utf-8 -*-
"""调整StackArea位置到更靠上"""
import json

def fix_stack_area():
    file_path = r'd:\coco_poker\assets\scenes\GameScene.scene'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    for item in data:
        if isinstance(item, dict) and item.get('_name') == 'StackArea' and item.get('__type__') == 'cc.Node':
            lpos = item.get('_lpos', {})
            old_y = lpos.get('y', 0)
            lpos['y'] = -200  # 更靠上
            print(f'StackArea Y: {old_y} -> -200')
    
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    
    print('完成!')

if __name__ == '__main__':
    fix_stack_area()
