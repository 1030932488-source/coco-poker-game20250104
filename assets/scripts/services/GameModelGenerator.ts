import { GameModel } from '../models/GameModel';
import { CardModel } from '../models/CardModel';
import { LevelConfig } from '../configs/models/LevelConfig';
import { Vec3 } from 'cc';

/**
 * 游戏模型生成服务
 * 将静态配置（LevelConfig）转换为动态运行时数据（GameModel）
 * 这是一个无状态服务，不持有数据，只负责数据转换
 */
export class GameModelGenerator {
    private static _cardIdCounter: number = 0;

    /**
     * 从关卡配置生成游戏模型
     * @param levelConfig 关卡配置
     * @returns 游戏模型
     */
    static generateGameModel(levelConfig: LevelConfig): GameModel {
        const gameModel = new GameModel();
        this._cardIdCounter = 0;

        // 生成主牌区的卡牌
        gameModel.playfieldCards = levelConfig.Playfield.map(config => {
            return new CardModel(
                this._getNextCardId(),
                config.CardFace,
                config.CardSuit,
                new Vec3(config.Position.x, config.Position.y, 0),
                true // 主牌区的牌默认翻开
            );
        });

        // 生成备用牌堆的卡牌
        gameModel.stackCards = levelConfig.Stack.map(config => {
            return new CardModel(
                this._getNextCardId(),
                config.CardFace,
                config.CardSuit,
                new Vec3(config.Position.x, config.Position.y, 0),
                false // 备用牌堆的牌默认背面朝上
            );
        });

        // 注意：初始底牌由 GameController 负责“从备用牌堆抽一张并MoveTo到底牌区”来产生
        gameModel.wasteCards = [];
        gameModel.baseCard = null;

        return gameModel;
    }

    /**
     * 获取下一个卡牌ID
     */
    private static _getNextCardId(): number {
        return ++this._cardIdCounter;
    }
}

