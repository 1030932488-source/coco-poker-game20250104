# -*- coding: utf-8 -*-
"""调整StackArea位置,让底牌堆显示在屏幕内"""
import json

def fix_stack_area_position():
    file_path = r'd:\coco_poker\assets\scenes\GameScene.scene'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    for item in data:
        if isinstance(item, dict) and item.get('_name') == 'StackArea' and item.get('__type__') == 'cc.Node':
            lpos = item.get('_lpos', {})
            old_y = lpos.get('y', 0)
            # 从-750改到-400,让底牌堆更靠上
            lpos['y'] = -400
            modified = True
            print(f'StackArea Y位置: {old_y} -> -400')
    
    if modified:
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print('StackArea位置修改成功!')
    
    return modified

if __name__ == '__main__':
    fix_stack_area_position()
