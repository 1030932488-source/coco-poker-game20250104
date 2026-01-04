import { _decorator, Component, Node, UITransform, Vec3 } from 'cc';
import { GameModel } from '../models/GameModel';
import { CardModel } from '../models/CardModel';
import { UndoModel, UndoActionType } from '../models/UndoModel';
import { GameView } from '../views/GameView';
import { PlayfieldView } from '../views/PlayfieldView';
import { StackView } from '../views/StackView';
import { BaseCardView } from '../views/BaseCardView';
import { CardView } from '../views/CardView';
import { UndoManager } from '../managers/UndoManager';
import { LevelConfigLoader } from '../configs/loaders/LevelConfigLoader';
import { GameModelGenerator } from '../services/GameModelGenerator';
import { CardMatchService } from '../services/CardMatchService';
import { CardResService } from '../services/CardResService';
import { Constants } from '../utils/Constants';
import { Logger } from '../utils/Logger';
const { ccclass, property } = _decorator;

/**
 * 游戏主控制器
 * - 负责对接 View 的交互回调
 * - 调用 Service 判断规则
 * - 更新 Model，并驱动 View 播放 MoveTo 动画
 *
 * 目标：严格对齐需求文档的“点击匹配 + 抽牌 + 回退反向MoveTo”。
 */
@ccclass('GameController')
export class GameController extends Component {
    @property(GameView)
    gameView: GameView = null!;

    @property(PlayfieldView)
    playfieldView: PlayfieldView = null!;

    @property(StackView)
    stackView: StackView = null!;

    @property(BaseCardView)
    baseCardView: BaseCardView = null!;

    /** 游戏数据模型 */
    private _gameModel: GameModel | null = null;
    /** 回退管理器（只管理回退记录栈，不直接改Model/驱动动画） */
    private _undoManager: UndoManager = new UndoManager();
    /** 动画锁（防止动画中重复点击导致状态错乱） */
    private _isAnimating: boolean = false;

    /**
     * 开始游戏：加载资源/配置，生成 Model 并初始化视图
     */
    public async startGame(levelId: number): Promise<void> {
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

    private _initViews(): void {
        console.log('[GameController._initViews] 开始初始化视图...');
        if (!this._gameModel) {
            console.error('[GameController._initViews] _gameModel 为 null!');
            return;
        }

        console.log('[GameController._initViews] 主牌区卡牌数量:', this._gameModel.playfieldCards.length);
        console.log('[GameController._initViews] 备用牌堆卡牌数量:', this._gameModel.stackCards.length);

        console.log('[GameController._initViews] 初始化 PlayfieldView...');
        this.playfieldView.init(this._gameModel.playfieldCards, (cardId) => this._onPlayfieldCardClick(cardId));

        console.log('[GameController._initViews] 初始化 StackView...');
        this.stackView.init(this._gameModel.stackCards, () => this._onStackAreaClick());

        console.log('[GameController._initViews] 初始化 GameView...');
        this.gameView.init(() => this._onUndoClick());

        console.log('[GameController._initViews] 视图初始化完成');
    }

    private _initBaseCardFromStack(): void {
        if (!this._gameModel) return;

        const card = this._popTopStackCard();
        if (!card) {
            Logger.warn('stackCards empty: cannot init base card');
            return;
        }

        const cardView = this.stackView.getCardView(card.id);
        if (!cardView) {
            Logger.warn(`cardView not found for stack card: ${card.id}`);
            return;
        }

        card.isFaceUp = true;
        this._pushWaste(card);

        this.baseCardView.attachCard(cardView);
        cardView.updateDisplay();
    }

    /**
     * 主牌区：点击匹配
     */
    private _onPlayfieldCardClick(cardId: number): void {
        console.log('[GameController._onPlayfieldCardClick] 收到点击, cardId:', cardId);

        if (this._isAnimating || !this._gameModel) {
            console.log('[GameController._onPlayfieldCardClick] 拒绝: 动画中或无gameModel');
            return;
        }

        const card = this._findCardInPlayfield(cardId);
        console.log('[GameController._onPlayfieldCardClick] 找到卡牌:', card ? `ID=${card.id}, face=${card.face}, isFaceUp=${card.isFaceUp}` : '未找到');
        if (!card || !card.isFaceUp) {
            console.log('[GameController._onPlayfieldCardClick] 拒绝: 卡牌不存在或背面朝上');
            return;
        }

        const base = this._gameModel.baseCard;
        console.log('[GameController._onPlayfieldCardClick] 底牌:', base ? `ID=${base.id}, face=${base.face}` : '无底牌');
        if (!base) {
            console.log('[GameController._onPlayfieldCardClick] 拒绝: 无底牌');
            return;
        }

        const canMatch = CardMatchService.canMatch(base, card);
        console.log('[GameController._onPlayfieldCardClick] 匹配结果:', canMatch,
            `底牌点数=${base.face}, 目标点数=${card.face}, 差值=${Math.abs(base.face - card.face)}`);
        if (!canMatch) {
            console.log('[GameController._onPlayfieldCardClick] 拒绝: 点数不匹配');
            return;
        }

        console.log('[GameController._onPlayfieldCardClick] ✓ 匹配成功! 执行移动');
        this._movePlayfieldCardToBase(card, base);
    }

    /**
     * 备用牌堆：点击抽牌（仅当主牌区无可匹配牌时允许）
     */
    private _onStackAreaClick(): void {
        if (this._isAnimating || !this._gameModel) return;

        if (CardMatchService.hasMatchableCard(this._gameModel.baseCard, this._gameModel.playfieldCards)) {
            return;
        }

        const top = this._peekTopStackCard();
        if (!top) return;

        this._drawStackCardToBase(top);
    }

    /**
     * 主牌区卡牌匹配：MoveTo 到底牌区并替换底牌
     */
    private _movePlayfieldCardToBase(card: CardModel, currentBase: CardModel): void {
        if (!this._gameModel) return;

        const cardView = this.playfieldView.getCardView(card.id);
        if (!cardView) return;

        // 先获取 node 引用并检查
        const cardNode = (cardView as any).node as Node;
        if (!cardNode || !cardNode.parent) return;

        this._isAnimating = true;

        this._undoManager.addUndoRecord(
            new UndoModel(UndoActionType.PLAYFIELD_TO_BASE, card.id, currentBase.id, card.isFaceUp)
        );

        const baseWorld = this.baseCardView.getAnchorWorldPosition();
        const targetLocal = this._worldToLocal(baseWorld, cardNode.parent);

        this.playfieldView.playCardMoveAnimation(card.id, targetLocal, () => {
            // Model：从主牌区移除 -> 放入废牌堆
            this._removePlayfieldCard(card.id);
            this._pushWaste(card);

            // View：挂到底牌区并置顶
            this.baseCardView.attachCard(cardView);
            cardView.updateDisplay();

            this._isAnimating = false;
            this._updateUI();
            this._checkGameOver();
        });
    }

    /**
     * 备用牌堆抽牌：MoveTo 到底牌区并替换底牌
     */
    private _drawStackCardToBase(card: CardModel): void {
        if (!this._gameModel) return;

        const currentBaseId = this._gameModel.baseCard ? this._gameModel.baseCard.id : null;
        const cardView = this.stackView.getCardView(card.id);
        if (!cardView) return;

        // 先获取 node 引用并检查
        const cardNode = (cardView as any).node as Node;
        if (!cardNode || !cardNode.parent) return;

        this._isAnimating = true;

        this._undoManager.addUndoRecord(
            new UndoModel(UndoActionType.STACK_TO_BASE, card.id, currentBaseId, card.isFaceUp)
        );

        const baseWorld = this.baseCardView.getAnchorWorldPosition();
        const targetLocal = this._worldToLocal(baseWorld, cardNode.parent);

        cardView.playMoveAnimation(targetLocal, Constants.kCardMoveDuration, () => {
            // Model：从备用牌堆弹出 -> 翻开 -> 放入废牌堆
            const popped = this._popTopStackCard();
            if (!popped || popped.id !== card.id) {
                Logger.warn('stack pop mismatch on draw', { expect: card.id, got: popped?.id });
            }

            card.isFaceUp = true;
            this._pushWaste(card);

            // View：挂到底牌区并置顶
            this.baseCardView.attachCard(cardView);
            cardView.updateDisplay();

            this._isAnimating = false;
            this._updateUI();
        });
    }

    /**
     * 回退：将"最后一张移动到底牌区的牌"反向 MoveTo 回原位
     */
    private _onUndoClick(): void {
        if (this._isAnimating || !this._gameModel) return;

        const record = this._undoManager.popUndoRecord();
        if (!record) return;

        const movedCardId = record.movedCardId;
        const movedCard = this._findCardById(movedCardId);
        if (!movedCard) return;

        const cardView = this._getCardViewForUndo(record);
        if (!cardView) return;

        // 先获取 node 引用并检查
        const cardNode = (cardView as any).node as Node;
        if (!cardNode || !cardNode.parent) return;

        this._isAnimating = true;

        const target = this._getUndoTarget(record, movedCard);
        const targetWorld = this._localToWorld(target.localPos, target.parent);
        const targetLocalInCurrentParent = this._worldToLocal(targetWorld, cardNode.parent);

        cardView.playMoveAnimation(targetLocalInCurrentParent, Constants.kCardMoveDuration, () => {
            // Model：从废牌堆弹出（应为 movedCard）
            const poppedWaste = this._popWaste();
            if (!poppedWaste || poppedWaste.id !== movedCard.id) {
                Logger.warn('waste pop mismatch on undo', { expect: movedCard.id, got: poppedWaste?.id });
            }

            // Model + View：回到来源区域
            if (record.actionType === UndoActionType.PLAYFIELD_TO_BASE) {
                this._gameModel!.playfieldCards.push(movedCard);
                movedCard.isFaceUp = record.movedCardPreviousIsFaceUp;
                const playfieldNode = (this.playfieldView as any).node as Node;
                cardNode.setParent(playfieldNode);
                cardNode.setPosition(movedCard.position);
            } else {
                this._gameModel!.stackCards.push(movedCard);
                movedCard.isFaceUp = record.movedCardPreviousIsFaceUp;
                const stackNode = (this.stackView as any).node as Node;
                cardNode.setParent(stackNode);
                cardNode.setPosition(Vec3.ZERO);
            }

            cardView.updateDisplay();

            this._isAnimating = false;
            this._updateUI();
        });
    }

    private _updateUI(): void {
        this.gameView.setUndoButtonEnabled(this._undoManager.getUndoCount() > 0);
    }

    private _checkGameOver(): void {
        if (!this._gameModel) return;
        if (this._gameModel.playfieldCards.length === 0) {
            this._gameModel.isGameOver = true;
            this._gameModel.isWin = true;
            Logger.log('Game Win!');
        }
    }

    private _findCardInPlayfield(cardId: number): CardModel | null {
        if (!this._gameModel) return null;
        return this._gameModel.playfieldCards.find(c => c.id === cardId) ?? null;
    }

    private _removePlayfieldCard(cardId: number): void {
        if (!this._gameModel) return;
        const idx = this._gameModel.playfieldCards.findIndex(c => c.id === cardId);
        if (idx >= 0) this._gameModel.playfieldCards.splice(idx, 1);
    }

    private _peekTopStackCard(): CardModel | null {
        if (!this._gameModel) return null;
        return this._gameModel.stackCards.length > 0
            ? this._gameModel.stackCards[this._gameModel.stackCards.length - 1]
            : null;
    }

    private _popTopStackCard(): CardModel | null {
        if (!this._gameModel) return null;
        return this._gameModel.stackCards.length > 0 ? this._gameModel.stackCards.pop()! : null;
    }

    private _pushWaste(card: CardModel): void {
        if (!this._gameModel) return;
        this._gameModel.wasteCards.push(card);
        this._gameModel.refreshBaseCard();
    }

    private _popWaste(): CardModel | null {
        if (!this._gameModel) return null;
        const card = this._gameModel.wasteCards.length > 0 ? this._gameModel.wasteCards.pop()! : null;
        this._gameModel.refreshBaseCard();
        return card;
    }

    private _findCardById(cardId: number): CardModel | null {
        if (!this._gameModel) return null;
        const inPlayfield = this._gameModel.playfieldCards.find(c => c.id === cardId);
        if (inPlayfield) return inPlayfield;
        const inStack = this._gameModel.stackCards.find(c => c.id === cardId);
        if (inStack) return inStack;
        const inWaste = this._gameModel.wasteCards.find(c => c.id === cardId);
        if (inWaste) return inWaste;
        return null;
    }

    private _getCardViewForUndo(record: UndoModel): CardView | undefined {
        if (record.actionType === UndoActionType.PLAYFIELD_TO_BASE) {
            return this.playfieldView.getCardView(record.movedCardId);
        }
        return this.stackView.getCardView(record.movedCardId);
    }

    private _getUndoTarget(record: UndoModel, movedCard: CardModel): { parent: Node; localPos: Vec3 } {
        if (record.actionType === UndoActionType.PLAYFIELD_TO_BASE) {
            const playfieldNode = (this.playfieldView as any).node as Node;
            return { parent: playfieldNode, localPos: movedCard.position.clone() };
        }
        const stackNode = (this.stackView as any).node as Node;
        return { parent: stackNode, localPos: Vec3.ZERO.clone() };
    }

    private _worldToLocal(worldPos: Vec3, parent: Node): Vec3 {
        const ui = parent.getComponent(UITransform);
        return ui ? ui.convertToNodeSpaceAR(worldPos) : worldPos.clone();
    }

    private _localToWorld(localPos: Vec3, parent: Node): Vec3 {
        const ui = parent.getComponent(UITransform);
        return ui ? ui.convertToWorldSpaceAR(localPos) : localPos.clone();
    }
}

