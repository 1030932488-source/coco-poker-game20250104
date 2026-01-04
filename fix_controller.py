# -*- coding: utf-8 -*-
"""修复GameController.ts文件的startGame方法"""

def fix_game_controller():
    file_path = r'd:\coco_poker\assets\scripts\controllers\GameController.ts'
    
    # 读取文件
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 替换损坏的startGame方法
    # 找到方法开始
    start_marker = '    public async startGame(levelId: number): Promise<void> {'
    end_marker = '    private _initViews(): void {'
    
    start_idx = content.find(start_marker)
    end_idx = content.find(end_marker)
    
    if start_idx == -1 or end_idx == -1:
        print('错误: 无法找到startGame方法的边界')
        return False
    
    # 新的startGame方法内容
    new_method = '''    public async startGame(levelId: number): Promise<void> {
        try {
            console.log('[GameController] ========== 开始游戏 - 关卡 ' + levelId + ' ==========');
            
            this._isAnimating = false;
            this._undoManager.clear();

            // 预加载卡牌资源（来自 res.zip）
            console.log('[GameController] 步骤1: 预加载卡牌资源...');
            await CardResService.preload();
            console.log('[GameController] 步骤1完成: 卡牌资源加载成功');

            // 加载关卡配置
            console.log('[GameController] 步骤2: 加载关卡配置 (levelId=' + levelId + ')...');
            const levelConfig = await LevelConfigLoader.loadLevelConfigAsync(levelId);
            console.log('[GameController] 步骤2完成: 关卡配置加载成功');

            // 生成 Model
            console.log('[GameController] 步骤3: 生成游戏模型...');
            this._gameModel = GameModelGenerator.generateGameModel(levelConfig);
            console.log('[GameController] 步骤3完成: 游戏模型生成成功');

            // 初始化视图（生成主牌区/备用牌堆卡牌节点）
            console.log('[GameController] 步骤4: 初始化视图...');
            this._initViews();
            console.log('[GameController] 步骤4完成: 视图初始化成功');

            // 初始底牌：从备用牌堆抽一张到"底牌区"（不计入回退）
            console.log('[GameController] 步骤5: 初始化底牌...');
            this._initBaseCardFromStack();
            console.log('[GameController] 步骤5完成: 底牌初始化成功');

            this._updateUI();
            console.log('[GameController] ========== 游戏启动完成! ==========');
        } catch (error) {
            console.error('[GameController] 错误: startGame 失败');
            console.error('[GameController] 错误信息:', error);
            if (error instanceof Error) {
                console.error('[GameController] 错误堆栈:', error.stack);
            }
            throw error;
        }
    }

    '''
    
    # 构建新内容
    new_content = content[:start_idx] + new_method + content[end_idx:]
    
    # 写回文件
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print('成功修复GameController.ts文件!')
    return True

if __name__ == '__main__':
    fix_game_controller()
