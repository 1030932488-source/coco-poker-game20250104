# -*- coding: utf-8 -*-
"""修复Camera的visibility,使其能看到Card Layer"""
import json

def fix_camera_visibility():
    file_path = r'd:\coco_poker\assets\scenes\GameScene.scene'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Card的Layer
    card_layer = 33554432  # UI_2D层 (第25位)
    
    modified = False
    for item in data:
        if isinstance(item, dict) and item.get('__type__') == 'cc.Camera':
            old_visibility = item.get('_visibility', 0)
            # 添加Card Layer到visibility
            new_visibility = old_visibility | card_layer
            if new_visibility != old_visibility:
                item['_visibility'] = new_visibility
                modified = True
                print(f'Camera visibility 修改: {old_visibility} -> {new_visibility}')
                print(f'  添加了 Layer bit: {card_layer} (第{card_layer.bit_length()-1}位)')
    
    if modified:
        # 写回文件
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print('Camera visibility 修改成功!')
    else:
        print('未找到需要修改的Camera组件')
    
    return modified

if __name__ == '__main__':
    fix_camera_visibility()
