import { _decorator, Component, Node, Sprite, SpriteFrame, Vec3, tween, EventTouch, Color, UITransform } from 'cc';
import { CardModel } from '../models/CardModel';
import { CardSuitType, CardFaceType } from '../enums/CardEnums';
import { CardResService } from '../services/CardResService';
const { ccclass, property } = _decorator;

/**
 * 卡牌视图组件
 * 负责卡牌的UI显示和动画效果
 * 视图层只负责显示和接收用户输入，不包含业务逻辑
 */
@ccclass('CardView')
export class CardView extends Component {
    @property(Sprite)
    cardSprite: Sprite = null!; // 作为“牌底/背景”

    @property(SpriteFrame)
    cardBackSpriteFrame: SpriteFrame = null!; // 卡牌背面

    @property([SpriteFrame])
    cardFaceSpriteFrames: SpriteFrame[] = []; // 卡牌正面（需要根据点数花色加载）

    /** 数字Sprite（运行时自动创建） */
    private _numberSprite: Sprite | null = null;
    /** 花色Sprite（运行时自动创建） */
    private _suitSprite: Sprite | null = null;

    /** 卡牌数据模型 */
    private _cardModel: CardModel | null = null;
    /** 点击回调函数 */
    private _onClickCallback: ((cardId: number) => void) | null = null;

    /**
     * 初始化卡牌视图
     * @param cardModel 卡牌数据模型
     * @param onClickCallback 点击回调函数
     */
    public init(cardModel: CardModel, onClickCallback: (cardId: number) => void): void {
        console.log('[CardView.init] 卡牌ID:', cardModel.id, '花色:', cardModel.suit, '点数:', cardModel.face);
        console.log('[CardView.init] cardSprite:', this.cardSprite);
        this._cardModel = cardModel;
        this._onClickCallback = onClickCallback;
        this._ensureOverlaySprites();
        this.updateDisplay();
        this.setupTouchEvent();
        console.log('[CardView.init] 初始化完成');
    }

    /**
     * 更新显示
     */
    public updateDisplay(): void {
        console.log('[CardView.updateDisplay] 开始更新显示');
        if (!this._cardModel) {
            console.error('[CardView.updateDisplay] _cardModel 为 null!');
            return;
        }

        // 背景牌底（优先使用 res.zip 的 card_general）
        const bg = CardResService.getCardGeneral();
        console.log('[CardView.updateDisplay] card_general资源:', bg);
        console.log('[CardView.updateDisplay] cardSprite:', this.cardSprite);
        if (bg && this.cardSprite) {
            this.cardSprite.spriteFrame = bg;
            console.log('[CardView.updateDisplay] 背景设置成功');
        } else {
            console.warn('[CardView.updateDisplay] 背景设置失败! bg=', bg, 'cardSprite=', this.cardSprite);
        }

        console.log('[CardView.updateDisplay] isFaceUp:', this._cardModel.isFaceUp);
        if (this._cardModel.isFaceUp) {
            this._showCardFace();
        } else {
            this._showCardBack();
        }
    }

    /**
     * 显示卡牌正面
     */
    private _showCardFace(): void {
        this._ensureOverlaySprites();
        if (!this._numberSprite || !this._suitSprite) return;

        // 运行时从 resources/poker_res 自动取资源（无需手工配置52张牌图）
        const numberFrame = CardResService.getBigNumber(this._cardModel!.face, this._cardModel!.suit);
        const suitFrame = CardResService.getSuit(this._cardModel!.suit);

        if (numberFrame) this._numberSprite.spriteFrame = numberFrame;
        if (suitFrame) this._suitSprite.spriteFrame = suitFrame;

        this._numberSprite.node.active = true;
        this._suitSprite.node.active = true;
        this.cardSprite.color = Color.WHITE;
    }

    /**
     * 显示卡牌背面
     */
    private _showCardBack(): void {
        this._ensureOverlaySprites();
        if (this._numberSprite) this._numberSprite.node.active = false;
        if (this._suitSprite) this._suitSprite.node.active = false;

        if (this.cardBackSpriteFrame) {
            this.cardSprite.spriteFrame = this.cardBackSpriteFrame;
            this.cardSprite.color = Color.WHITE;
            return;
        }

        // 没有背面资源时：用 tint 模拟背面
        this.cardSprite.color = new Color(70, 120, 220, 255);
    }

    /**
     * 设置触摸事件
     */
    private setupTouchEvent(): void {
        this.node.on(Node.EventType.TOUCH_END, this._onCardClick, this);
    }

    /**
     * 卡牌点击事件
     */
    private _onCardClick(event: EventTouch): void {
        const nodeName = this.node.parent?.name || 'Unknown';
        console.log(`[CardView._onCardClick] >>> [${nodeName}] 节点被点击! ID:`, this._cardModel?.id);

        // 视觉反馈：点击时闪烁黄色
        if (this.cardSprite) {
            this.cardSprite.color = Color.YELLOW;
            this.scheduleOnce(() => {
                if (this.cardSprite) this.cardSprite.color = Color.WHITE;
            }, 0.1);
        }

        if (this._cardModel && this._onClickCallback && this._cardModel.isFaceUp) {
            console.log(`[CardView._onCardClick] [${nodeName}] 符合点击条件，触发回调`);
            this._onClickCallback(this._cardModel.id);
        } else {
            console.log(`[CardView._onCardClick] [${nodeName}] 点击被忽略, 原因:`,
                !this._cardModel ? '无数据' :
                    !this._onClickCallback ? '无回调' :
                        !this._cardModel.isFaceUp ? '背面朝上' : '未知');
        }
    }

    /**
     * 播放移动动画
     * @param targetPosition 目标位置
     * @param duration 动画时长（秒）
     * @param callback 完成回调
     */
    public playMoveAnimation(targetPosition: Vec3, duration: number = 0.3, callback?: () => void): void {
        tween(this.node)
            .to(duration, { position: targetPosition })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }

    /**
     * 播放翻牌动画
     * @param callback 完成回调
     */
    public playFlipAnimation(callback?: () => void): void {
        // 缩放翻转效果
        tween(this.node)
            .to(0.15, { scale: new Vec3(0, 1, 1) })
            .call(() => {
                this.updateDisplay();
            })
            .to(0.15, { scale: new Vec3(1, 1, 1) })
            .call(() => {
                if (callback) callback();
            })
            .start();
    }

    /**
     * 确保数字/花色 Sprite 存在（自动创建）
     */
    private _ensureOverlaySprites(): void {
        if (this._numberSprite && this._suitSprite) return;

        // 数字节点
        const numberNode = new Node('Number');
        const numberSprite = numberNode.addComponent(Sprite);
        numberNode.setParent(this.node);
        numberNode.setPosition(new Vec3(0, 30, 0));
        numberNode.addComponent(UITransform);

        // 花色节点
        const suitNode = new Node('Suit');
        const suitSprite = suitNode.addComponent(Sprite);
        suitNode.setParent(this.node);
        suitNode.setPosition(new Vec3(0, -40, 0));
        suitNode.addComponent(UITransform);

        this._numberSprite = numberSprite;
        this._suitSprite = suitSprite;
    }

    /**
     * 获取卡牌模型
     */
    public getCardModel(): CardModel | null {
        return this._cardModel;
    }
}

