import { _decorator, Component } from 'cc';
import { GameController } from '../controllers/GameController';
const { ccclass, property } = _decorator;

/**
 * 游戏场景
 * 场景入口，初始化游戏控制器
 */
@ccclass('GameScene')
export class GameScene extends Component {
    @property(GameController)
    gameController: GameController = null!;

    onLoad() {
        console.log('[GameScene] onLoad - 场景加载完成');
        
        // 场景加载完成后,开始游戏
        if (!this.gameController) {
            console.error('[GameScene] 错误: GameController 引用未配置!');
            console.error('[GameScene] 请在Cocos Creator编辑器中检查GameScene组件的gameController属性');
            return;
        }
        
        console.log('[GameScene] GameController 引用正常,开始初始化游戏...');
        
        // 从关卡1开始（异步加载配置与资源）
        this.gameController.startGame(1)
            .then(() => {
                console.log('[GameScene] ✓ 游戏初始化成功!');
            })
            .catch((err: Error) => {
                console.error('[GameScene] ✗ 游戏初始化失败:', err);
                console.error('[GameScene] 错误堆栈:', err.stack);
            });
    }
}

