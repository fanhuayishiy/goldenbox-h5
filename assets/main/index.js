System.register("chunks:///_virtual/adPolicy.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        canShowInterstitial: canShowInterstitial,
        canShowRewarded: canShowRewarded,
        createAdPolicyState: createAdPolicyState,
        endGame: endGame,
        markInterstitialShown: markInterstitialShown,
        markRewardedShown: markRewardedShown,
        raiseOffer: raiseOffer,
        startNewGame: startNewGame
      });
      cclegacy._RF.push({}, "d0a6bEd8ntJCbkFh7ipg7p1", "adPolicy", undefined);
      /**
       * 广告策略：激励视频各点位限制、插屏频控、银行家加价。
       *
       * 激励视频点位：
       *   settle_double   — 结算双倍金币    每局 1 次
       *   banker_raise    — 银行家加价 +15% 每局 2 次
       *   lose_comp_double — 连败补偿翻倍   每局 1 次
       *   signin_double   — 签到双倍       每日 1 次
       *
       * 插屏广告频控：
       *   每 3 局最多 1 次，冷却至少 120 秒，首局完成后不弹，新用户首日不弹。
       */
      // ─── 点位类型 ─────────────────────────────────────
      // ─── 常量 ─────────────────────────────────────────

      var REWARDED_LIMITS = exports('REWARDED_LIMITS', {
        settle_double: {
          perGame: 1,
          perDay: Infinity
        },
        banker_raise: {
          perGame: 2,
          perDay: Infinity
        },
        lose_comp_double: {
          perGame: 1,
          perDay: Infinity
        },
        signin_double: {
          perGame: Infinity,
          perDay: 1
        }
      });

      /** 银行家加价比例 */
      var BANKER_RAISE_PERCENT = exports('BANKER_RAISE_PERCENT', 0.15);
      /** 插屏：每至少间隔多少局 1 次 */
      var INTERSTITIAL_GAME_GAP = exports('INTERSTITIAL_GAME_GAP', 3);
      /** 插屏冷却时间（毫秒） */
      var INTERSTITIAL_COOLDOWN_MS = exports('INTERSTITIAL_COOLDOWN_MS', 120000);
      /** 首局完成后不弹插屏 */
      var INTERSTITIAL_SKIP_FIRST_GAME = exports('INTERSTITIAL_SKIP_FIRST_GAME', true);
      /** 新用户首日不弹插屏 */
      var INTERSTITIAL_SKIP_NEW_USER_DAY = exports('INTERSTITIAL_SKIP_NEW_USER_DAY', true);

      // ─── 策略状态 ────────────────────────────────────

      function createAdPolicyState() {
        return {
          perGame: {
            settle_double: 0,
            banker_raise: 0,
            lose_comp_double: 0,
            signin_double: 0
          },
          perDay: {
            settle_double: 0,
            banker_raise: 0,
            lose_comp_double: 0,
            signin_double: 0
          },
          gamesPlayed: 0,
          lastInterstitialTime: 0,
          lastInterstitialGame: 0,
          isNewUserFirstDay: true
        };
      }

      // ─── 激励视频 ────────────────────────────────────

      function canShowRewarded(p, slot) {
        var limit = REWARDED_LIMITS[slot];
        return p.perGame[slot] < limit.perGame && p.perDay[slot] < limit.perDay;
      }
      function markRewardedShown(p, slot) {
        p.perGame[slot]++;
        p.perDay[slot]++;
      }

      // ─── 局次管理 ────────────────────────────────────

      /** 新一局开始：重置每局计数 */
      function startNewGame(p) {
        p.perGame = {
          settle_double: 0,
          banker_raise: 0,
          lose_comp_double: 0,
          signin_double: 0
        };
      }

      /** 一局结算完成：局数 +1（用于插屏频控） */
      function endGame(p) {
        p.gamesPlayed++;
      }

      // ─── 插屏 ─────────────────────────────────────────

      function canShowInterstitial(p, now) {
        if (p.gamesPlayed < 2) return false;
        if (p.isNewUserFirstDay) return false;
        if (p.gamesPlayed - p.lastInterstitialGame < INTERSTITIAL_GAME_GAP) return false;
        if (now - p.lastInterstitialTime < INTERSTITIAL_COOLDOWN_MS) return false;
        return true;
      }
      function markInterstitialShown(p, now) {
        p.lastInterstitialTime = now;
        p.lastInterstitialGame = p.gamesPlayed;
      }

      // ─── 银行家加价 ──────────────────────────────────

      /** 银行家加价后的报价（先取整到整数消除浮点误差，再取整到 10） */
      function raiseOffer(offer) {
        var raised = Math.round(offer * (1 + BANKER_RAISE_PERCENT));
        return Math.round(raised / 10) * 10;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/ads.config.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e5727/tPXxK9rW7Mspn0dq+", "ads.config", undefined);
      /** 广告位 ID 配置。提审前填入真实 ID；留空时平台层自动降级并保证流程可继续。 */
      var ADS_CONFIG = exports('ADS_CONFIG', {
        rewarded: {
          settle_double: '',
          banker_raise: '',
          lose_comp_double: '',
          signin_double: ''
        },
        interstitial: ''
      });
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/app.ts", ['cc', './index.ts', './walletStore.ts', './gameStore.ts', './uiStore.ts'], function (exports) {
  var cclegacy, createPlatform, WalletStore, GameStore, UiStore;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      createPlatform = module.createPlatform;
    }, function (module) {
      WalletStore = module.WalletStore;
    }, function (module) {
      GameStore = module.GameStore;
    }, function (module) {
      UiStore = module.UiStore;
    }],
    execute: function () {
      exports('createApp', createApp);
      cclegacy._RF.push({}, "03808GluklFubZbz71p7Sfn", "app", undefined);
      function createApp() {
        var platform = createPlatform();
        var wallet = new WalletStore(platform.storage);
        var game = new GameStore();
        var ui = new UiStore();
        return {
          platform: platform,
          wallet: wallet,
          game: game,
          ui: ui
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/banker.ts", ['cc', './types2.ts'], function (exports) {
  var cclegacy, JACKPOT_AMOUNT;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      JACKPOT_AMOUNT = module.JACKPOT_AMOUNT;
    }],
    execute: function () {
      exports({
        computeOffer: computeOffer,
        isJackpotAlive: isJackpotAlive
      });
      cclegacy._RF.push({}, "20b38BqaqhAKZrbzUGqn6iL", "banker", undefined);
      /** 各轮次报价系数（R1..R6）：前期压低、后期抬高，放大翻盘张力 */
      var ROUND_COEFFICIENTS = exports('ROUND_COEFFICIENTS', [0.26, 0.34, 0.46, 0.66, 0.9, 1.18]);

      /** 头奖仍存活且轮次 >= R4 时的系数加成 */
      var JACKPOT_ALIVE_BONUS = exports('JACKPOT_ALIVE_BONUS', 0.06);
      /** 头奖刚被打开后，下一轮系数的减损 */
      var JACKPOT_JUST_OPENED_PENALTY = exports('JACKPOT_JUST_OPENED_PENALTY', 0.15);
      /** 报价最低值 */
      var MIN_OFFER = exports('MIN_OFFER', 50);
      /** 抖动幅度 ±8% */
      var JITTER_RANGE = exports('JITTER_RANGE', 0.08);
      function computeOffer(p) {
        var _ROUND_COEFFICIENTS;
        if (p.remainingAmounts.length === 0) return MIN_OFFER;
        var coefficient = (_ROUND_COEFFICIENTS = ROUND_COEFFICIENTS[p.round - 1]) != null ? _ROUND_COEFFICIENTS : 0;
        if (p.jackpotAlive && p.round >= 4) coefficient += JACKPOT_ALIVE_BONUS;
        if (p.jackpotOpenedLastRound) {
          coefficient = Math.max(0, coefficient - JACKPOT_JUST_OPENED_PENALTY);
        }
        var expectation = p.remainingAmounts.reduce(function (sum, v) {
          return sum + v;
        }, 0) / p.remainingAmounts.length;
        var jitter = p.rng ? (p.rng.next() * 2 - 1) * JITTER_RANGE : 0;
        var raw = expectation * coefficient * (1 + jitter);
        return Math.max(MIN_OFFER, Math.round(raw / 10) * 10);
      }

      /** 头奖是否仍存活（未出现在已揭示金额中） */
      function isJackpotAlive(revealedAmounts) {
        return !revealedAmounts.includes(JACKPOT_AMOUNT);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/bootstrap.ts", ['cc', './GameRoot.ts'], function () {
  var cclegacy, director, Director, GameRoot;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
      director = module.director;
      Director = module.Director;
    }, function (module) {
      GameRoot = module.GameRoot;
    }],
    execute: function () {
      cclegacy._RF.push({}, "e9736Iwe3ZMt5hQ0Y3BkIoZ", "bootstrap", undefined);
      var attach = function attach() {
        var scene = director.getScene();
        var canvas = scene ? scene.getChildByName('Canvas') : null;
        if (canvas && !canvas.getComponent(GameRoot)) {
          canvas.addComponent(GameRoot);
        }
      };
      if (director.getScene()) {
        attach();
      } else {
        director.once(Director.EVENT_AFTER_SCENE_LAUNCH, attach);
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/boxSet.ts", ['cc', './types2.ts', './rng.ts'], function (exports) {
  var cclegacy, BOX_AMOUNTS, TOTAL_BOXES, shuffle;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      BOX_AMOUNTS = module.BOX_AMOUNTS;
      TOTAL_BOXES = module.TOTAL_BOXES;
    }, function (module) {
      shuffle = module.shuffle;
    }],
    execute: function () {
      exports({
        createBoxSet: createBoxSet,
        isValidBoxId: isValidBoxId
      });
      cclegacy._RF.push({}, "211c4OFX3dNvb6B5Y1M5AVI", "boxSet", undefined);
      function createBoxSet(rng) {
        var amounts = shuffle(rng, BOX_AMOUNTS);
        var index = new Map();
        amounts.forEach(function (v, i) {
          return index.set(v, i);
        });
        return {
          boxAmounts: amounts,
          amountOf: function amountOf(boxId) {
            return amounts[boxId];
          },
          boxIdOf: function boxIdOf(amount) {
            return index.get(amount);
          },
          setAmount: function setAmount(boxId, amount) {
            var old = amounts[boxId];
            if (old === amount) return;
            index["delete"](old);
            index.set(amount, boxId);
            amounts[boxId] = amount;
          }
        };
      }
      function isValidBoxId(boxId) {
        return Number.isInteger(boxId) && boxId >= 0 && boxId < TOTAL_BOXES;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/economy.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        addDays: addDays,
        claimSignin: claimSignin,
        dateKey: dateKey,
        loseCompensationBase: loseCompensationBase,
        restoreEnergy: restoreEnergy,
        settleGame: settleGame,
        streakRewardFor: streakRewardFor,
        tryConsumeEnergy: tryConsumeEnergy
      });
      cclegacy._RF.push({}, "efe3ebWtSFIGYhP06jUKBSH", "economy", undefined);
      /**
       * 经济系统：金币、体力、连胜奖励、连败补偿、签到。
       *
       * 体力上限 10，每 20 分钟恢复 1 点，首次进入赠送满体力。
       * 首版不做真实充值，体力不足时展示 Mock 广告或提示。
       */
      // ─── 常量 ─────────────────────────────────────────

      var MAX_ENERGY = exports('MAX_ENERGY', 10);
      /** 体力恢复间隔（毫秒） */
      var ENERGY_RECOVER_MS = exports('ENERGY_RECOVER_MS', 20 * 60 * 1000);
      /** 每局消耗体力 */
      var ENERGY_COST_PER_GAME = exports('ENERGY_COST_PER_GAME', 1);
      /** 首次进入赠送满体力 */
      var INITIAL_ENERGY = exports('INITIAL_ENERGY', MAX_ENERGY);

      /** 连胜奖励里程碑与对应金币数 */
      var STREAK_REWARDS = exports('STREAK_REWARDS', [[3, 500], [5, 2000], [10, 8888]]);

      /** 7 天签到循环奖励 */
      var SIGNIN_REWARDS = exports('SIGNIN_REWARDS', [200, 400, 800, 1200, 2000, 3500, 8888]);

      /** 连败补偿：最后报价的 10% */
      var LOSE_COMP_RATIO = exports('LOSE_COMP_RATIO', 0.1);
      /** 连败至少多少局后开始补偿 */
      var LOSE_COMP_MIN_STREAK = exports('LOSE_COMP_MIN_STREAK', 2);

      // ─── 状态接口 ─────────────────────────────────────

      // ─── 工具函数 ─────────────────────────────────────

      function dateKey(ts) {
        var d = new Date(ts);
        var y = d.getFullYear();
        var m = String(d.getMonth() + 1).padStart(2, '0');
        var day = String(d.getDate()).padStart(2, '0');
        return y + "-" + m + "-" + day;
      }
      function addDays(ts, days) {
        var d = new Date(ts);
        d.setDate(d.getDate() + days);
        return d.getTime();
      }

      // ─── 体力 ─────────────────────────────────────────

      /** 按时间恢复体力（返回新状态，不修改原对象） */
      function restoreEnergy(state, now) {
        var elapsed = Math.max(0, now - state.lastEnergyAt);
        var restored = Math.floor(elapsed / ENERGY_RECOVER_MS);
        if (restored <= 0) return state;
        var newEnergy = Math.min(MAX_ENERGY, state.energy + restored);
        return _extends({}, state, {
          energy: newEnergy,
          lastEnergyAt: state.lastEnergyAt + restored * ENERGY_RECOVER_MS
        });
      }

      /** 尝试消耗体力；不足时返回 null */
      function tryConsumeEnergy(state, cost) {
        if (cost === void 0) {
          cost = ENERGY_COST_PER_GAME;
        }
        if (state.energy < cost) return null;
        return _extends({}, state, {
          energy: state.energy - cost
        });
      }

      // ─── 连胜奖励 ─────────────────────────────────────

      /** 返回里程碑奖励（未达到返回 0） */
      function streakRewardFor(streak) {
        for (var _iterator = _createForOfIteratorHelperLoose(STREAK_REWARDS), _step; !(_step = _iterator()).done;) {
          var _step$value = _step.value,
            need = _step$value[0],
            reward = _step$value[1];
          if (streak === need) return reward;
        }
        return 0;
      }

      // ─── 连败补偿 ─────────────────────────────────────

      /** 连败补偿基础值：最后报价的 10%（向下取整） */
      function loseCompensationBase(finalOffer) {
        return Math.floor(finalOffer * LOSE_COMP_RATIO);
      }

      // ─── 结算 ─────────────────────────────────────────

      /** 结算单局结果，返回更新后的钱包状态和结算明细；shieldUsed 表示连胜护盾生效（失败不清空连胜且不发里程碑奖励） */
      function settleGame(state, record, opts) {
        var _opts$compDoubled, _opts$shieldUsed;
        if (opts === void 0) {
          opts = {};
        }
        var compDoubled = (_opts$compDoubled = opts.compDoubled) != null ? _opts$compDoubled : false;
        var shieldUsed = (_opts$shieldUsed = opts.shieldUsed) != null ? _opts$shieldUsed : false;
        var won = record.wonBanker;
        var winStreak = won ? state.winStreak + 1 : shieldUsed ? state.winStreak : 0;
        var loseStreak = won ? 0 : state.loseStreak + 1;
        var streakReward = !won && shieldUsed ? 0 : streakRewardFor(winStreak);
        var base = loseCompensationBase(record.finalOffer);
        var compensation = loseStreak >= LOSE_COMP_MIN_STREAK ? compDoubled ? Math.floor(base * 1.5) : base : 0;
        var coinsDelta = record.finalAmount + streakReward + compensation;
        return {
          state: _extends({}, state, {
            coins: state.coins + coinsDelta,
            winStreak: winStreak,
            loseStreak: loseStreak,
            totalGames: state.totalGames + 1,
            totalWins: state.totalWins + (won ? 1 : 0),
            highestSingle: Math.max(state.highestSingle, record.finalAmount)
          }),
          result: {
            coinsDelta: coinsDelta,
            streakReward: streakReward,
            loseCompensation: compensation,
            compDoubled: compDoubled && compensation > 0,
            newStreak: winStreak
          }
        };
      }

      // ─── 签到 ─────────────────────────────────────────

      /** 签到；当天已签到时返回 null */
      function claimSignin(state, now, opts) {
        if (opts === void 0) {
          opts = {};
        }
        var today = dateKey(now);
        if (state.lastSigninDate === today) return null;
        var yesterday = dateKey(addDays(now, -1));
        var streakDays = state.lastSigninDate === yesterday ? state.streakDays + 1 : 1;
        var base = SIGNIN_REWARDS[(streakDays - 1) % SIGNIN_REWARDS.length];
        var reward = opts.doubled ? Math.floor(base * 1.5) : base;
        return {
          state: {
            lastSigninDate: today,
            streakDays: streakDays
          },
          reward: reward
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/errorHook.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "05b65W8FQtOVK0N4SScPiba", "errorHook", undefined);
      /**
       * 全局错误捕获：尽早注册（本模块是脚本包中最早加载的模块之一），
       * 把启动期未捕获异常暴露到 window.__gbErr 便于无控制台环境排查。
       */
      if (typeof window !== 'undefined') {
        var w = window;
        if (!w.__gbErrHooked) {
          w.__gbErrHooked = true;
          w.addEventListener('error', function (e) {
            var _ref, _e$error$stack, _e$error;
            if (!w.__gbErr) w.__gbErr = String((_ref = (_e$error$stack = (_e$error = e.error) == null ? void 0 : _e$error.stack) != null ? _e$error$stack : e.message) != null ? _ref : e);
          });
          w.addEventListener('unhandledrejection', function (e) {
            var _e$reason$stack, _e$reason;
            if (!w.__gbErr) w.__gbErr = 'unhandledrejection: ' + String((_e$reason$stack = (_e$reason = e.reason) == null ? void 0 : _e$reason.stack) != null ? _e$reason$stack : e.reason);
          });
        }
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/eventBus.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "df6bfEHEfFJ1oLDeASc2yld", "eventBus", undefined);
      /** 极简类型化事件总线（双端共享状态使用） */
      var EventBus = exports('EventBus', /*#__PURE__*/function () {
        function EventBus() {
          this.listeners = new Set();
        }
        var _proto = EventBus.prototype;
        _proto.on = function on(listener) {
          var _this = this;
          this.listeners.add(listener);
          return function () {
            _this.listeners["delete"](listener);
          };
        };
        _proto.emit = function emit(value) {
          for (var _iterator = _createForOfIteratorHelperLoose(this.listeners), _step; !(_step = _iterator()).done;) {
            var l = _step.value;
            l(value);
          }
        };
        return EventBus;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/format.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports('formatAmount', formatAmount);
      cclegacy._RF.push({}, "1c0e2O79NRNCoXkfgBinAuY", "format", undefined);
      /** 金额格式化：带千分位，例如 1,000,000 */
      function formatAmount(n) {
        return n.toLocaleString('en-US');
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gameMachine.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './types2.ts', './boxSet.ts', './rng.ts', './banker.ts', './adPolicy.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, _createClass, cclegacy, ROUND_OPEN_COUNTS, TOTAL_BOXES, JACKPOT_AMOUNT, TOTAL_ROUNDS, isValidBoxId, randomInt, isJackpotAlive, computeOffer, raiseOffer;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ROUND_OPEN_COUNTS = module.ROUND_OPEN_COUNTS;
      TOTAL_BOXES = module.TOTAL_BOXES;
      JACKPOT_AMOUNT = module.JACKPOT_AMOUNT;
      TOTAL_ROUNDS = module.TOTAL_ROUNDS;
    }, function (module) {
      isValidBoxId = module.isValidBoxId;
    }, function (module) {
      randomInt = module.randomInt;
    }, function (module) {
      isJackpotAlive = module.isJackpotAlive;
      computeOffer = module.computeOffer;
    }, function (module) {
      raiseOffer = module.raiseOffer;
    }],
    execute: function () {
      cclegacy._RF.push({}, "78d8d53RI1GO4UfMRrkjujn", "gameMachine", undefined);

      // ─── 事件接口 ───────────────────────────────────────

      // ─── 游戏快照（供表现层初始化或同步读取） ──────────────

      // ─── 状态机 ─────────────────────────────────────────

      var GameMachine = exports('GameMachine', /*#__PURE__*/function () {
        function GameMachine(boxSet, rng) {
          this._state = 'PICK_OWN';
          this.boxSet = void 0;
          this.rng = void 0;
          this.ownBoxId = null;
          this.opened = new Set();
          this.revealedAmounts = [];
          this.round = 0;
          this.openedThisRound = 0;
          this.rounds = [];
          this.currentOffer = 0;
          this.dealt = false;
          this.dealAmount = 0;
          this.finalAmount = 0;
          this.swapped = false;
          this.jackpotOpenedThisRound = false;
          this.jackpotOpenedLastRound = false;
          /** 高金额保护生效的轮次（0 = 未激活） */
          this.protectedRound = 0;
          /** 保护期间被锁定（不可打开）的金额 */
          this.protectedAmounts = new Set();
          this.listeners = [];
          this.boxSet = boxSet;
          this.rng = rng;
        }
        var _proto = GameMachine.prototype;
        _proto.getSnapshot = function getSnapshot() {
          var _ROUND_OPEN_COUNTS;
          return {
            state: this._state,
            ownBoxId: this.ownBoxId,
            round: this.round,
            openedThisRound: this.openedThisRound,
            toOpen: (_ROUND_OPEN_COUNTS = ROUND_OPEN_COUNTS[this.round - 1]) != null ? _ROUND_OPEN_COUNTS : 0,
            openedCount: this.opened.size,
            revealedAmounts: this.revealedAmounts.slice(),
            offers: this.rounds.map(function (r) {
              return r.offer;
            }),
            protectedRound: this.protectedRound,
            protectedAmounts: Array.from(this.protectedAmounts),
            boxAmounts: this.boxSet.boxAmounts.slice()
          };
        }

        /** 订阅状态机事件；返回取消订阅函数 */;
        _proto.on = function on(listener) {
          var _this = this;
          this.listeners.push(listener);
          return function () {
            var idx = _this.listeners.indexOf(listener);
            if (idx >= 0) _this.listeners.splice(idx, 1);
          };
        }

        // ─── 公开动作 ─────────────────────────────────

        /** 选择自己的宝箱（PICK_OWN） */;
        _proto.pickOwn = function pickOwn(boxId) {
          if (!this.guard('PICK_OWN')) return;
          if (!isValidBoxId(boxId)) {
            this.emit({
              type: 'error',
              message: "invalid boxId: " + boxId
            });
            return;
          }
          this.ownBoxId = boxId;
          this.beginRound(1);
        }

        /** 超时自动选择自己的宝箱 */;
        _proto.autoPickOwn = function autoPickOwn() {
          if (!this.guard('PICK_OWN')) return;
          var boxId = randomInt(this.rng, 0, TOTAL_BOXES - 1);
          this.pickOwn(boxId);
        }

        /** 道具「去低券」：去掉一个金额最低的箱子，不占用本轮开箱数。返回被去掉的箱号，非法状态返回 null */;
        _proto.eliminateLowest = function eliminateLowest() {
          if (this._state !== 'PICK_OWN' && this._state !== 'OPENING') return null;
          var best = null;
          var bestAmount = Infinity;
          for (var i = 0; i < TOTAL_BOXES; i++) {
            if (i === this.ownBoxId || this.opened.has(i)) continue;
            var a = this.boxSet.amountOf(i);
            if (a < bestAmount) {
              bestAmount = a;
              best = i;
            }
          }
          if (best === null) return null;
          var amount = bestAmount;
          this.opened.add(best);
          this.revealedAmounts.push(amount);
          var roundIdx = Math.max(0, this.round - 1);
          if (this.rounds[roundIdx]) {
            this.rounds[roundIdx].opened.push({
              boxId: best,
              amount: amount
            });
          }
          this.emit({
            type: 'boxEliminated',
            round: this.round,
            boxId: best,
            amount: amount
          });
          return best;
        }

        /** 道具「护高券」：立即重排未开箱位置，并将本轮剩余高金额（上一半）锁定——点到即拒绝。失败返回 false */;
        _proto.activateProtectHigh = function activateProtectHigh() {
          if (this._state !== 'PICK_OWN' && this._state !== 'OPENING') return false;
          if (this.protectedRound === this.round && this.round > 0) return false;
          this.protectedRound = Math.max(1, this.round);
          this.shuffleClosed();
          // 锁定未开箱中金额较高的那一半（保留中位数，与低半分界）
          var closed = [];
          for (var i = 0; i < TOTAL_BOXES; i++) {
            if (!this.opened.has(i)) closed.push(this.boxSet.amountOf(i));
          }
          closed.sort(function (a, b) {
            return a - b;
          });
          var lowHalf = Math.ceil(closed.length / 2);
          var threshold = closed[lowHalf - 1];
          this.protectedAmounts.clear();
          for (var _i = 0, _closed = closed; _i < _closed.length; _i++) {
            var a = _closed[_i];
            if (a > threshold) this.protectedAmounts.add(a);
          }
          this.emit({
            type: 'protectedHigh',
            round: this.protectedRound
          });
          return true;
        }

        /** 未开箱子（含自己的宝箱）之间的金额随机重排 */;
        _proto.shuffleClosed = function shuffleClosed() {
          var _this2 = this;
          var ids = [];
          var amounts = [];
          for (var i = 0; i < TOTAL_BOXES; i++) {
            if (!this.opened.has(i)) {
              ids.push(i);
              amounts.push(this.boxSet.amountOf(i));
            }
          }
          for (var _i2 = amounts.length - 1; _i2 > 0; _i2--) {
            var j = randomInt(this.rng, 0, _i2);
            var _ref = [amounts[j], amounts[_i2]];
            amounts[_i2] = _ref[0];
            amounts[j] = _ref[1];
          }
          ids.forEach(function (id, k) {
            return _this2.boxSet.setAmount(id, amounts[k]);
          });
        }

        /** 打开一个宝箱（OPENING）。护高锁定中的箱子拒绝打开 */;
        _proto.openBox = function openBox(boxId) {
          if (!this.guard('OPENING')) return;
          if (boxId === this.ownBoxId) {
            this.emit({
              type: 'error',
              message: 'cannot open own box'
            });
            return;
          }
          if (!isValidBoxId(boxId)) {
            this.emit({
              type: 'error',
              message: "invalid boxId: " + boxId
            });
            return;
          }
          if (this.opened.has(boxId)) {
            this.emit({
              type: 'error',
              message: 'box already opened'
            });
            return;
          }
          if (this.protectedRound === this.round && this.protectedAmounts.has(this.boxSet.amountOf(boxId))) {
            // 高金额保护：锁定的箱子点到即拒绝（表现层播放拒绝抖动）
            this.emit({
              type: 'protectedBlocked',
              boxId: boxId
            });
            return;
          }
          var amount = this.boxSet.amountOf(boxId);
          this.opened.add(boxId);
          this.revealedAmounts.push(amount);
          this.openedThisRound++;
          if (amount === JACKPOT_AMOUNT) {
            this.jackpotOpenedThisRound = true;
          }

          // 记录到轮次信息
          var roundIdx = this.round - 1;
          this.rounds[roundIdx].opened.push({
            boxId: boxId,
            amount: amount
          });
          var toOpen = ROUND_OPEN_COUNTS[roundIdx];
          this.emit({
            type: 'boxOpened',
            round: this.round,
            boxId: boxId,
            amount: amount,
            openedThisRound: this.openedThisRound,
            toOpen: toOpen
          });
          if (this.openedThisRound >= toOpen) {
            this.finishOpening();
          }
        }

        /** 对报价做出决定（OFFER） */;
        _proto.decide = function decide(accept) {
          if (!this.guard('OFFER')) return;
          var round = this.round;
          var offer = this.currentOffer;
          if (accept) {
            this.dealt = true;
            this.dealAmount = offer;
            this.finalAmount = offer;
            this.rounds[round - 1].offerAccepted = true;
            var ownAmount = this.boxSet.amountOf(this.ownBoxId);
            this.emit({
              type: 'dealMade',
              round: round,
              offer: offer,
              ownAmount: ownAmount
            });
            this.enterReveal(ownAmount, offer, false);
            return;
          }

          // 不成交
          this.emit({
            type: 'noDeal',
            round: round
          });
          this.rounds[round - 1].offerAccepted = false;
          if (round >= TOTAL_ROUNDS) {
            var finalOffer = this.currentOffer;
            this._state = 'FINAL_TWO';
            this.emit({
              type: 'stateChanged',
              state: 'FINAL_TWO'
            });
            this.emit({
              type: 'finalTwo',
              finalOffer: finalOffer
            });
          } else {
            this.beginRound(round + 1);
          }
        }

        /** 超时自动决定：不成交 */;
        _proto.autoDecide = function autoDecide() {
          this.decide(false);
        }

        /** 银行家加价（激励广告奖励）：上调当前报价并同步轮次记录；非 OFFER 状态返回 null */;
        _proto.raiseCurrentOffer = function raiseCurrentOffer() {
          if (this._state !== 'OFFER') return null;
          var raised = raiseOffer(this.currentOffer);
          this.currentOffer = raised;
          var roundInfo = this.rounds[this.round - 1];
          if (roundInfo) roundInfo.offer = raised;
          return raised;
        }

        /** 终局二选一（FINAL_TWO） */;
        _proto.chooseFinal = function chooseFinal(swap) {
          if (!this.guard('FINAL_TWO')) return;
          var ownAmount = this.boxSet.amountOf(this.ownBoxId);
          var finalAmount;
          if (swap) {
            var other = this.otherClosedBox();
            if (other === null) {
              this.emit({
                type: 'error',
                message: 'no other box to swap'
              });
              return;
            }
            finalAmount = this.boxSet.amountOf(other);
            this.swapped = true;
          } else {
            finalAmount = ownAmount;
          }
          this.finalAmount = finalAmount;
          this.enterReveal(ownAmount, finalAmount, this.swapped);
        }

        /** 揭晓动画结束后结算（REVEAL -> SETTLE） */;
        _proto.completeReveal = function completeReveal() {
          if (!this.guard('REVEAL')) return;
          var record = this.buildRecord();
          this._state = 'SETTLE';
          this.emit({
            type: 'stateChanged',
            state: 'SETTLE'
          });
          this.emit({
            type: 'gameEnd',
            record: record
          });
        }

        // ─── 内部方法 ─────────────────────────────────
        ;

        _proto.guard = function guard(expected) {
          if (this._state === expected) return true;
          this.emit({
            type: 'error',
            message: "invalid transition: state=" + this._state + ", expected=" + expected
          });
          return false;
        };
        _proto.beginRound = function beginRound(round) {
          this.round = round;
          this.openedThisRound = 0;
          this.jackpotOpenedThisRound = false;

          // 头奖在上轮末已翻转为 lastRound，进入新轮时重置
          // 注意：jackpotOpenedLastRound 在 finishOpening 中设置

          var toOpen = ROUND_OPEN_COUNTS[round - 1];
          this._state = 'OPENING';
          this.emit({
            type: 'stateChanged',
            state: 'OPENING'
          });
          this.emit({
            type: 'roundStart',
            round: round,
            toOpen: toOpen
          });

          // 初始化轮次记录
          this.rounds[round - 1] = {
            round: round,
            opened: [],
            offer: 0,
            offerAccepted: false
          };
        };
        _proto.finishOpening = function finishOpening() {
          var _this3 = this;
          var round = this.round;
          var remainingAmounts = [].concat(this.boxSet.boxAmounts).filter(function (a) {
            return !_this3.revealedAmounts.includes(a);
          });
          var jackpotAlive = isJackpotAlive(this.revealedAmounts);
          var offer = computeOffer({
            round: round,
            remainingAmounts: remainingAmounts,
            jackpotAlive: jackpotAlive,
            jackpotOpenedLastRound: this.jackpotOpenedLastRound,
            rng: this.rng
          });

          // 更新 jackpot 状态供下一轮使用
          this.jackpotOpenedLastRound = this.jackpotOpenedThisRound;
          this.currentOffer = offer;
          this.rounds[round - 1].offer = offer;
          this._state = 'OFFER';
          this.emit({
            type: 'stateChanged',
            state: 'OFFER'
          });
          this.emit({
            type: 'offerReady',
            round: round,
            offer: offer
          });
        };
        _proto.enterReveal = function enterReveal(ownAmount, finalAmount, swapped) {
          this._state = 'REVEAL';
          this.emit({
            type: 'reveal',
            ownAmount: ownAmount,
            finalAmount: finalAmount,
            swapped: swapped
          });
          this.emit({
            type: 'stateChanged',
            state: 'REVEAL'
          });
        };
        _proto.otherClosedBox = function otherClosedBox() {
          var closed = [];
          for (var i = 0; i < TOTAL_BOXES; i++) {
            if (i !== this.ownBoxId && !this.opened.has(i)) {
              closed.push(i);
            }
          }
          if (closed.length === 0) return null;
          return closed[randomInt(this.rng, 0, closed.length - 1)];
        };
        _proto.buildRecord = function buildRecord() {
          var ownAmount = this.boxSet.amountOf(this.ownBoxId);
          var finalOffer = this.dealt ? this.dealAmount : this.currentOffer;
          return {
            ownBoxId: this.ownBoxId,
            ownAmount: ownAmount,
            rounds: this.rounds.map(function (r) {
              return {
                round: r.round,
                opened: r.opened.map(function (o) {
                  return _extends({}, o);
                }),
                offer: r.offer,
                offerAccepted: r.offerAccepted
              };
            }),
            dealt: this.dealt,
            dealAmount: this.dealAmount,
            finalOffer: finalOffer,
            swapped: this.swapped,
            finalAmount: this.finalAmount,
            wonBanker: this.finalAmount >= finalOffer
          };
        };
        _proto.emit = function emit(event) {
          for (var _iterator = _createForOfIteratorHelperLoose(this.listeners), _step; !(_step = _iterator()).done;) {
            var l = _step.value;
            l(event);
          }
        };
        _createClass(GameMachine, [{
          key: "state",
          get: function get() {
            return this._state;
          }
        }]);
        return GameMachine;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/GameRoot.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './app.ts', './adPolicy.ts', './economy.ts', './types2.ts', './profileStore.ts', './format.ts', './widgets.ts'], function (exports) {
  var _inheritsLoose, _createForOfIteratorHelperLoose, _createClass, cclegacy, _decorator, view, ResolutionPolicy, Canvas, profiler, Tween, tween, Graphics, Color, Label, UIOpacity, UITransform, Node, Vec3, Widget, Sprite, Component, createApp, canShowInterstitial, markInterstitialShown, canShowRewarded, SIGNIN_REWARDS, dateKey, TOTAL_BOXES, BOX_AMOUNTS, ProfileStore, ENERGY_POTION_PRICE, SHIELD_PRICE, ITEM_REMOVE_LOW_PRICE, ITEM_PROTECT_HIGH_PRICE, formatAmount, DESIGN_W, DESIGN_H, COLORS, applyTheme, preloadSprites, makePanel, uiNode, makeSprite, makeLabel, makeSpriteButton, makeButton, makeRect, amountColor, makeTitle;
  return {
    setters: [function (module) {
      _inheritsLoose = module.inheritsLoose;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
      _decorator = module._decorator;
      view = module.view;
      ResolutionPolicy = module.ResolutionPolicy;
      Canvas = module.Canvas;
      profiler = module.profiler;
      Tween = module.Tween;
      tween = module.tween;
      Graphics = module.Graphics;
      Color = module.Color;
      Label = module.Label;
      UIOpacity = module.UIOpacity;
      UITransform = module.UITransform;
      Node = module.Node;
      Vec3 = module.Vec3;
      Widget = module.Widget;
      Sprite = module.Sprite;
      Component = module.Component;
    }, function (module) {
      createApp = module.createApp;
    }, function (module) {
      canShowInterstitial = module.canShowInterstitial;
      markInterstitialShown = module.markInterstitialShown;
      canShowRewarded = module.canShowRewarded;
    }, function (module) {
      SIGNIN_REWARDS = module.SIGNIN_REWARDS;
      dateKey = module.dateKey;
    }, function (module) {
      TOTAL_BOXES = module.TOTAL_BOXES;
      BOX_AMOUNTS = module.BOX_AMOUNTS;
    }, function (module) {
      ProfileStore = module.ProfileStore;
      ENERGY_POTION_PRICE = module.ENERGY_POTION_PRICE;
      SHIELD_PRICE = module.SHIELD_PRICE;
      ITEM_REMOVE_LOW_PRICE = module.ITEM_REMOVE_LOW_PRICE;
      ITEM_PROTECT_HIGH_PRICE = module.ITEM_PROTECT_HIGH_PRICE;
    }, function (module) {
      formatAmount = module.formatAmount;
    }, function (module) {
      DESIGN_W = module.DESIGN_W;
      DESIGN_H = module.DESIGN_H;
      COLORS = module.COLORS;
      applyTheme = module.applyTheme;
      preloadSprites = module.preloadSprites;
      makePanel = module.makePanel;
      uiNode = module.uiNode;
      makeSprite = module.makeSprite;
      makeLabel = module.makeLabel;
      makeSpriteButton = module.makeSpriteButton;
      makeButton = module.makeButton;
      makeRect = module.makeRect;
      amountColor = module.amountColor;
      makeTitle = module.makeTitle;
    }],
    execute: function () {
      var _dec, _class;
      cclegacy._RF.push({}, "8cbc8bTI5ZGSKzrnPyQxMQk", "GameRoot", undefined);
      var ccclass = _decorator.ccclass;
      var BOX_SIZE = 140;
      var BOX_GAP = 16;
      var GRID_COLS = 4;

      /** 首页用到的切图（assets/resources/ui），启动时预加载 */
      var HOME_SPRITES = ['divider', 'title', 'panel_gold', 'pill_energy', 'btn_energy', 'btn_start', 'btn_signin', 'btn_rank', 'btn_shop', 'btn_settings', 'laurel_l', 'laurel_r', 'wing_b', 'chest', 'coin_cluster', 'coin_stack', 'coin_tilt', 'coin_flat', 'sparkle_big', 'sparkle_small', 'dome_glow'];

      /** 开箱页用到的切图（含宝箱动画 5 帧与特效） */
      var PLAY_SPRITES = ['box_closed', 'box_unlocking', 'box_open_lid', 'box_open_burst', 'box_open_settled', 'box_own', 'fx_burst', 'fx_ring', 'leaf_l', 'leaf_r', 'stage_round'];

      /** 银行家报价页切图（来自设计稿精灵图切片） */
      var OFFER_SPRITES = ['banker_crown', 'banker_phone', 'banker_title', 'banker_dollar', 'banker_label', 'banker_quote', 'banker_amount_bg', 'banker_timer_bg', 'banker_clock', 'banker_accept_btn', 'banker_continue_btn', 'banker_bottom_deco', 'banker_footer'];

      /** 签到页用到的切图（scripts/slice-signin.js 从设计精灵图切出） */
      var SIGNIN_SPRITES = ['signin_title2', 'signin_coin', 'signin_chest_glow', 'signin_btn_sign', 'signin_btn_done', 'signin_btn_ad', 'signin_btn_ad_dim', 'signin_stamp_claimed', 'signin_coins_corner'];
      var GameRoot = exports('GameRoot', (_dec = ccclass('GameRoot'), _dec(_class = /*#__PURE__*/function (_Component) {
        _inheritsLoose(GameRoot, _Component);
        function GameRoot() {
          var _this;
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          _this = _Component.call.apply(_Component, [this].concat(args)) || this;
          _this.app = void 0;
          _this.profile = void 0;
          _this.panels = new Map();
          // 对局内动态状态
          _this.currentOffer = 0;
          _this.revealed = new Map();
          _this.roundNo = 0;
          _this.roundToOpen = 0;
          _this.roundOpened = 0;
          _this.pickLeft = 0;
          _this.offerLeft = 0;
          _this.settleRecord = null;
          _this.settleResult = null;
          _this.settleDoubled = false;
          _this.compDoubled = false;
          _this.signinBase = 0;
          // 动态 UI 引用
          _this.boxNodes = [];
          _this.playStatus = null;
          _this.playTimer = null;
          _this.moneyCells = [];
          _this.offerFloat = null;
          _this.offerFloatRing = null;
          _this.floatCd = null;
          _this.offerWaiting = false;
          /** 银行家来电铃重响倒计时（秒） */
          _this.bankerRingIn = 0;
          /** 正在播放开箱动画的宝箱集合（连续开箱互不打断），refreshPlay 跳过其中箱子 */
          _this.animatingBoxes = new Set();
          /** 页面右上角声音开关的图标 Label（首页/开箱页各一个） */
          _this.soundBtnLabels = [];
          /** 开箱页道具按钮（去低券/护高券） */
          _this.itemLowBtn = null;
          _this.itemProBtn = null;
          /** 银行家来电期间的全屏触摸遮挡 */
          _this.gridBlocker = null;
          /** 开箱金额全屏展示层（暗幕 + 金光 + 大字金额） */
          _this.centerFx = null;
          _this.centerLabel = null;
          _this.centerDimOp = null;
          _this.centerRing = null;
          _this.centerRingOp = null;
          _this.pendingOpenFinal = null;
          _this.offerAmount = null;
          _this.offerTimer = null;
          _this.offerFooter = null;
          _this.offerRaiseBtn = null;
          _this.revealOverlay = null;
          _this.revealOwn = null;
          _this.revealFinal = null;
          _this.toastLabel = null;
          _this.pulseTarget = null;
          // ─── 倒计时 ───────────────────────────────────
          _this.tickTimers = function () {
            var m = _this.machine;
            if (!m) return;
            if (_this.pickLeft > 0 && m.state === 'PICK_OWN') {
              _this.pickLeft = Math.max(0, _this.pickLeft - 0.5);
              if (_this.playTimer) _this.playTimer.string = "" + Math.ceil(_this.pickLeft);
              if (_this.pickLeft === 0) m.autoPickOwn();
            }
            if (_this.playTimer && _this.playTimer.node.parent) {
              _this.playTimer.node.parent.active = _this.pickLeft > 0 && m.state === 'PICK_OWN';
            }
            if (_this.offerLeft > 0 && m.state === 'OFFER') {
              var _this$offerFloat;
              _this.offerLeft = Math.max(0, _this.offerLeft - 0.5);
              var secs = Math.ceil(_this.offerLeft);
              if (_this.offerTimer) _this.offerTimer.string = String(secs);
              if (_this.floatCd && (_this$offerFloat = _this.offerFloat) != null && _this$offerFloat.active) _this.floatCd.string = String(secs);
              if (_this.offerLeft === 0) m.autoDecide();
            }
            // 银行家等待期间周期性重响电话铃（点掉横幅即停）
            if (_this.offerWaiting) {
              _this.bankerRingIn -= 0.5;
              if (_this.bankerRingIn <= 0) {
                _this.app.platform.audio.playSfx('banker');
                _this.bankerRingIn = 3.5;
              }
            }
          };
          _this.hideToast = function () {
            var _this$toastLabel;
            if ((_this$toastLabel = _this.toastLabel) != null && _this$toastLabel.node.parent) _this.toastLabel.node.parent.active = false;
          };
          return _this;
        }
        var _proto = GameRoot.prototype;
        _proto.onLoad = function onLoad() {
          // 竖屏自适应：宽度固定 720 设计像素，高度随屏幕伸缩（FIXED_WIDTH），
          // 首页/开箱板按可视高度百分比布局，长屏不裁切、矮屏不拉伸
          view.setDesignResolutionSize(DESIGN_W, DESIGN_H, ResolutionPolicy.FIXED_WIDTH);
        }

        /** 相机清除色跟随主题，让宽屏两侧留边与舞台背景融为一体 */;
        _proto.applyCameraClear = function applyCameraClear() {
          var canvas = this.node.getComponent(Canvas);
          var camera = canvas == null ? void 0 : canvas.cameraComponent;
          if (camera) camera.clearColor = COLORS.bg;
        };
        _proto.start = function start() {
          var _this2 = this;
          try {
            // 隐藏左下角调试性能统计面板（debug 构建默认开启）
            try {
              profiler.hideStats();
            } catch (_unused) {
              // 释放构建无 profiler 模块，忽略
            }
            this.app = createApp();
            this.profile = new ProfileStore(this.app.platform.storage);
            applyTheme(this.profile.themeActive);
            this.applyCameraClear();
            this.app.platform.audio.setMuted(this.profile.muted);
            this.app.wallet.tick();
            this.app.game.events.on(function (e) {
              return _this2.onGameEvent(e);
            });

            // 先预加载首页/开箱页切图，再建全部面板并进入首页
            preloadSprites([].concat(HOME_SPRITES, PLAY_SPRITES, OFFER_SPRITES, SIGNIN_SPRITES)).then(function () {
              _this2.buildAllPanels();
              _this2.show('home');
              _this2.schedule(_this2.tickTimers, 0.5);
              // 测试钩子：供端到端测试读取状态
              globalThis.__gb = {
                app: _this2.app,
                profile: _this2.profile,
                root: _this2
              };
            });
          } catch (e) {
            var _stack;
            // 启动失败时把错误暴露给端到端测试排查
            globalThis.__gbErr = String((_stack = e == null ? void 0 : e.stack) != null ? _stack : e);
            throw e;
          }
        }

        // ─── 面板构建与重建 ───────────────────────────
        ;

        _proto.buildAllPanels = function buildAllPanels() {
          this.buildHome();
          this.buildPlay();
          this.buildOffer();
          this.buildFinalTwo();
          this.buildSettle();
          this.buildSignin();
          this.buildRank();
          this.buildShop();
          this.buildSettings();
          this.buildRevealOverlay();
          this.buildToast();
        }

        /** 主题切换后销毁并按新配色重建全部面板 */;
        _proto.rebuildPanels = function rebuildPanels() {
          Tween.stopAllByTarget(this.node);
          if (this.pulseTarget) {
            Tween.stopAllByTarget(this.pulseTarget);
            this.pulseTarget.setScale(1, 1, 1);
            this.pulseTarget = null;
          }
          for (var _iterator = _createForOfIteratorHelperLoose(this.panels.values()), _step; !(_step = _iterator()).done;) {
            var panel = _step.value;
            panel.root.destroy();
          }
          this.panels.clear();
          this.boxNodes = [];
          this.playStatus = this.playTimer = null;
          this.soundBtnLabels = [];
          this.centerFx = this.centerLabel = null;
          this.centerDimOp = null;
          this.centerRing = this.centerRingOp = null;
          this.pendingOpenFinal = null;
          this.itemLowBtn = this.itemProBtn = null;
          this.gridBlocker = null;
          this.moneyCells = [];
          this.offerFloat = null;
          this.offerFloatRing = null;
          this.floatCd = null;
          this.offerAmount = this.offerTimer = null;
          this.offerFooter = null;
          this.offerRaiseBtn = null;
          this.revealOverlay = null;
          this.revealOwn = this.revealFinal = null;
          this.toastLabel = null;
          this.applyCameraClear();
          this.buildAllPanels();
        };
        _proto.show = function show(name) {
          var _this$panels$get;
          this.app.ui.navigate(name);
          for (var _iterator2 = _createForOfIteratorHelperLoose(this.panels), _step2; !(_step2 = _iterator2()).done;) {
            var _step2$value = _step2.value,
              key = _step2$value[0],
              panel = _step2$value[1];
            panel.root.active = key === name;
          }
          (_this$panels$get = this.panels.get(name)) == null || _this$panels$get.refresh();
          // 背景音乐随场景切换（ctx 未就绪时引擎只记录意图，首次交互后自动起播）
          var gameScene = name === 'play' || name === 'finalTwo' || name === 'reveal' || name === 'settle';
          this.app.platform.audio.playBgm(gameScene ? 'game' : 'home');
        }

        // ─── 事件驱动 ─────────────────────────────────
        ;

        _proto.onGameEvent = function onGameEvent(e) {
          var _this$panels$get2, _this$panels$get3, _this$panels$get4, _boxAlreadyOpened$c;
          switch (e.type) {
            case 'roundStart':
              this.roundNo = e.round;
              this.roundToOpen = e.toOpen;
              this.roundOpened = 0;
              this.pickLeft = 0;
              this.show('play');
              // 后半程（第 4 轮起）切终局紧张变奏
              this.app.platform.audio.playBgm(e.round >= 4 ? 'final' : 'game');
              break;
            case 'boxOpened':
              this.revealed.set(e.boxId, e.amount);
              this.roundOpened = e.openedThisRound;
              // 三段开箱动画：抖动 → 爆闪切态 → 金额落位（完成后再刷新终态）
              this.app.platform.audio.playSfx('rumble');
              this.animatingBoxes.add(e.boxId);
              (_this$panels$get2 = this.panels.get('play')) == null || _this$panels$get2.refresh();
              this.playOpenAnim(e.boxId, e.amount);
              break;
            case 'boxEliminated':
              // 去低券效果：与开箱同样的动画表现，但不占用本轮开箱数
              this.revealed.set(e.boxId, e.amount);
              this.app.platform.audio.playSfx('rumble');
              this.animatingBoxes.add(e.boxId);
              (_this$panels$get3 = this.panels.get('play')) == null || _this$panels$get3.refresh();
              this.playOpenAnim(e.boxId, e.amount);
              this.toast('🧹 已去掉金额最低的箱子');
              break;
            case 'protectedHigh':
              this.toast('🛡 高金额已上锁，箱子已重新洗牌');
              break;
            case 'protectedBlocked':
              {
                // 锁定箱拒绝打开：抖动 + 提示
                var b = this.boxNodes.find(function (x) {
                  return x.index === e.boxId;
                });
                if (b) {
                  Tween.stopAllByTarget(b.node);
                  tween(b.node).to(0.06, {
                    angle: 3
                  }).to(0.06, {
                    angle: -3
                  }).to(0.05, {
                    angle: 0
                  }).start();
                }
                this.toast('🔒 该箱子本轮受保护，换个箱子试试');
                break;
              }
            case 'offerReady':
              // 留在开箱板：头部来电横幅 + 15 秒倒计时，点击才揭晓报价（倒计时延续到报价页）
              this.currentOffer = e.offer;
              this.offerLeft = 15;
              this.offerWaiting = true;
              this.show('play');
              (_this$panels$get4 = this.panels.get('play')) == null || _this$panels$get4.refresh();
              this.setOfferFloat(true);
              this.app.platform.audio.playSfx('banker');
              this.bankerRingIn = 3.5;
              break;
            case 'noDeal':
              this.offerLeft = 0;
              this.offerWaiting = false;
              this.setOfferFloat(false);
              this.app.platform.audio.playSfx('noDeal');
              break;
            case 'finalTwo':
              this.currentOffer = e.finalOffer;
              this.offerLeft = 0;
              this.offerWaiting = false;
              this.setOfferFloat(false);
              this.show('finalTwo');
              this.app.platform.audio.playSfx('suspense');
              this.app.platform.audio.playBgm('final');
              break;
            case 'dealMade':
              this.app.platform.audio.playSfx('deal');
              break;
            case 'reveal':
              this.pickLeft = 0;
              this.offerLeft = 0;
              this.offerWaiting = false;
              this.setOfferFloat(false);
              this.showReveal(e);
              this.app.platform.audio.playSfx(e.amount >= 5000 ? 'revealBig' : 'reveal');
              break;
            case 'gameEnd':
              this.onSettle(e.record);
              break;
            case 'error':
              // 核心层错误消息为英文，展示层统一翻译；正常操作已被上方拦截，走到这里多为异常
              this.toast((_boxAlreadyOpened$c = {
                'box already opened': '这个宝箱已经开过了',
                'cannot open own box': '不能打开自己的宝箱',
                'no other box to swap': '没有可交换的宝箱'
              }[e.message]) != null ? _boxAlreadyOpened$c : '操作无效，请重试');
              break;
          }
        }

        // ─── 流程动作 ─────────────────────────────────
        ;

        _proto.onStartGame = function onStartGame() {
          var m = this.machine;
          if (m && m.state !== 'SETTLE') {
            this.show('play'); // 回到进行中的对局
            return;
          }
          var next = this.app.wallet.consumeEnergy();
          if (!next) {
            this.toast('体力不足，可花 500 金币补满或等 20 分钟');
            return;
          }
          this.revealed.clear();
          this.roundNo = 0;
          this.roundToOpen = 0;
          this.roundOpened = 0;
          this.pickLeft = 0;
          this.offerLeft = 0;
          this.offerWaiting = false;
          this.setOfferFloat(false);
          this.settleRecord = null;
          this.settleResult = null;
          this.profile.startNewGame();
          this.app.game.startNewGame();
          this.pickLeft = 10; // 选箱 10 秒超时自动随机（先于 show，避免 refreshPlay 误藏倒计时）
          this.show('play');
        };
        _proto.onBackHome = function onBackHome() {
          var now = Date.now();
          if (canShowInterstitial(this.profile.ads, now)) {
            markInterstitialShown(this.profile.ads, now);
            this.profile.save();
            this.app.platform.ads.showInterstitial();
          }
          this.show('home');
        };
        _proto.onSettle = function onSettle(record) {
          this.settleRecord = record;
          this.settleDoubled = false;
          this.compDoubled = false;

          // 连胜护盾：输给银行家时消耗，保留连胜
          var shieldUsed = false;
          if (!record.wonBanker && this.profile.shieldActive) {
            shieldUsed = true;
            this.profile.consumeShield();
          }
          var _this$app$wallet$appl = this.app.wallet.applySettlement(record, {
              shieldUsed: shieldUsed
            }),
            result = _this$app$wallet$appl.result;
          this.settleResult = result;
          this.profile.addRank({
            ts: Date.now(),
            finalAmount: record.finalAmount,
            dealt: record.dealt,
            wonBanker: record.wonBanker,
            swapped: record.swapped
          });
          this.profile.endGame();
          this.app.platform.audio.playSfx(record.wonBanker ? 'win' : 'lose');
          this.show('settle');
          if (shieldUsed) this.toast('🛡 连胜护盾生效，连胜保留');
        }

        /** 激励视频统一入口：策略校验 -> 展示 -> 奖励发放 -> 计数 */;
        _proto.tryRewarded = function tryRewarded(slot, _onReward) {
          var _this3 = this;
          if (!this.profile.adsEnabled) return;
          if (!canShowRewarded(this.profile.ads, slot)) {
            this.toast('该广告次数已用完');
            return;
          }
          var ok = this.app.platform.ads.showRewarded(slot, {
            onReward: function onReward() {
              _this3.profile.markRewarded(slot);
              _onReward();
            },
            onClose: function onClose() {},
            onError: function onError() {
              return _this3.toast('广告暂不可用，请稍后再试');
            }
          });
          if (!ok) this.toast('广告暂不可用，请稍后再试');
        }

        // ─── 金币消费 ─────────────────────────────────
        ;

        _proto.onBuyEnergy = function onBuyEnergy() {
          var w = this.app.wallet.state;
          if (w.energy >= 10) {
            this.toast('体力已满');
            return;
          }
          if (w.coins < ENERGY_POTION_PRICE) {
            this.toast('金币不足');
            return;
          }
          if (this.app.wallet.buyFullEnergy(ENERGY_POTION_PRICE)) {
            var _this$panels$get5;
            this.toast("\u4F53\u529B\u5DF2\u8865\u6EE1\uFF08-" + formatAmount(ENERGY_POTION_PRICE) + " \u91D1\u5E01\uFF09");
            (_this$panels$get5 = this.panels.get('home')) == null || _this$panels$get5.refresh();
          }
        };
        _proto.onBuyShield = function onBuyShield() {
          var _this$panels$get6;
          if (this.profile.shieldActive) {
            this.toast('护盾已激活');
            return;
          }
          if (!this.app.wallet.spendCoins(SHIELD_PRICE)) {
            this.toast('金币不足');
            return;
          }
          this.profile.activateShield();
          this.toast("\uD83D\uDEE1 \u8FDE\u80DC\u62A4\u76FE\u5DF2\u6FC0\u6D3B\uFF08-" + formatAmount(SHIELD_PRICE) + " \u91D1\u5E01\uFF09");
          (_this$panels$get6 = this.panels.get('shop')) == null || _this$panels$get6.refresh();
        };
        _proto.onBuyRemoveLow = function onBuyRemoveLow() {
          var _this$panels$get7;
          if (!this.app.wallet.spendCoins(ITEM_REMOVE_LOW_PRICE)) {
            this.toast('金币不足');
            return;
          }
          this.profile.addItem('removeLow');
          this.toast("\uD83E\uDDF9 \u53BB\u4F4E\u5238 +1\uFF08-" + formatAmount(ITEM_REMOVE_LOW_PRICE) + " \u91D1\u5E01\uFF09");
          (_this$panels$get7 = this.panels.get('shop')) == null || _this$panels$get7.refresh();
        };
        _proto.onBuyProtectHigh = function onBuyProtectHigh() {
          var _this$panels$get8;
          if (!this.app.wallet.spendCoins(ITEM_PROTECT_HIGH_PRICE)) {
            this.toast('金币不足');
            return;
          }
          this.profile.addItem('protectHigh');
          this.toast("\uD83D\uDEE1 \u62A4\u9AD8\u5238 +1\uFF08-" + formatAmount(ITEM_PROTECT_HIGH_PRICE) + " \u91D1\u5E01\uFF09");
          (_this$panels$get8 = this.panels.get('shop')) == null || _this$panels$get8.refresh();
        };
        // ─── 首页（GPT 精灵图版，按可视高度百分比自适应竖屏） ──────
        _proto.buildHome = function buildHome() {
          var _this4 = this;
          var p = makePanel('home', this.node, false);
          var vh = view.getVisibleSize().height;
          var yAt = function yAt(fracTop) {
            return vh * (0.5 - fracTop);
          };

          // 背景氛围层：幕布紫光 + 顶部聚光锥 + 四角帷幕 + 暗角（对照效果图一比一还原）
          var deco = uiNode('homeDeco', p);
          var dg = deco.addComponent(Graphics);
          var topEdge = vh / 2;
          var hw = DESIGN_W / 2;
          dg.fillColor = new Color(92, 24, 78, 62);
          dg.circle(0, topEdge - 40, 430);
          dg.fill();
          // 中部暖色衬光，贴近效果图的面板区域底色
          dg.fillColor = new Color(150, 60, 110, 26);
          dg.circle(0, vh * (0.5 - 0.35), 330);
          dg.fill();
          dg.fillColor = new Color(255, 240, 210, 13);
          dg.moveTo(-64, topEdge);
          dg.lineTo(170, -topEdge * 0.05);
          dg.lineTo(-170, -topEdge * 0.05);
          dg.close();
          dg.fill();
          dg.fillColor = new Color(24, 7, 20, 150);
          dg.moveTo(-hw, topEdge);
          dg.bezierCurveTo(-hw + 34, topEdge - 150, -hw + 130, topEdge - 226, -hw + 262, topEdge - 196);
          dg.bezierCurveTo(-hw + 158, topEdge - 148, -hw + 62, topEdge - 78, -hw + 22, topEdge);
          dg.close();
          dg.fill();
          dg.moveTo(hw, topEdge);
          dg.bezierCurveTo(hw - 34, topEdge - 150, hw - 130, topEdge - 226, hw - 262, topEdge - 196);
          dg.bezierCurveTo(hw - 158, topEdge - 148, hw - 62, topEdge - 78, hw - 22, topEdge);
          dg.close();
          dg.fill();
          dg.fillColor = new Color(15, 4, 12, 175);
          dg.moveTo(-hw, -topEdge);
          dg.bezierCurveTo(-hw + 46, -topEdge + 128, -hw + 152, -topEdge + 206, -hw + 302, -topEdge + 184);
          dg.bezierCurveTo(-hw + 178, -topEdge + 136, -hw + 66, -topEdge + 66, -hw + 18, -topEdge);
          dg.close();
          dg.fill();
          dg.moveTo(hw, -topEdge);
          dg.bezierCurveTo(hw - 46, -topEdge + 128, hw - 152, -topEdge + 206, hw - 302, -topEdge + 184);
          dg.bezierCurveTo(hw - 178, -topEdge + 136, hw - 66, -topEdge + 66, hw - 18, -topEdge);
          dg.close();
          dg.fill();
          dg.lineWidth = 210;
          dg.strokeColor = new Color(9, 2, 7, 55);
          dg.circle(0, 0, hw + 200);
          dg.stroke();
          dg.lineWidth = 170;
          dg.strokeColor = new Color(9, 2, 7, 48);
          dg.circle(0, 0, hw + 420);
          dg.stroke();

          // 开始按钮背后的金色光晕 + 放射光线
          makeSprite('dome_glow', p, 600).setPosition(0, yAt(0.558));
          var rays = uiNode('startRays', p);
          rays.setPosition(0, yAt(0.558));
          var rg = rays.addComponent(Graphics);
          rg.fillColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 38);
          for (var i = 0; i < 14; i++) {
            var a = i * Math.PI * 2 / 14;
            var dx = Math.cos(a);
            var dy = Math.sin(a);
            rg.moveTo(dx * 150, dy * 150);
            rg.lineTo(dx * 278 + dy * 16, dy * 278 - dx * 16);
            rg.lineTo(dx * 278 - dy * 16, dy * 278 + dx * 16);
            rg.close();
            rg.fill();
          }

          // 细线小皇冠 / 立体标题
          makeSprite('divider', p, 210).setPosition(0, yAt(0.075));
          makeSprite('title', p, 505).setPosition(0, yAt(0.171));

          // 副标题：浅紫白文字 + 两侧金色羽翼
          makeLabel('16 个宝箱 · 谁是头奖幸运儿？', 27, new Color(224, 204, 228, 255), p).node.setPosition(0, yAt(0.258));
          var wingL = makeSprite('wing_b', p, 34);
          wingL.setPosition(-214, yAt(0.258));
          wingL.setScale(-1, 1, 1);
          makeSprite('wing_b', p, 34).setPosition(214, yAt(0.258));

          // 金币面板（深栗色内衬垫底 + 空金框压边 + 动态金币数字）
          var panelFill = uiNode('panelFill', p);
          panelFill.setPosition(0, yAt(0.33));
          var pfg = panelFill.addComponent(Graphics);
          pfg.fillColor = new Color(76, 23, 51, 245);
          pfg.roundRect(-216, -64, 432, 128, 24);
          pfg.fill();
          var coinBox = makeSprite('panel_gold', p, 480);
          coinBox.setPosition(0, yAt(0.33));
          var coinIcon = makeSprite('coin_tilt', coinBox, 30);
          coinIcon.setPosition(-32, 40);
          makeLabel('金币', 24, COLORS.gold, coinBox).node.setPosition(14, 40);
          var coinGlow = makeLabel('', 60, new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 55), coinBox);
          coinGlow.node.setPosition(0, -14);
          var coins = makeLabel('', 54, COLORS.gold, coinBox);
          coins.node.setPosition(0, -16);
          // 深棕描边，贴近效果图的立体数字
          var coinStyle = coins;
          coinStyle.enableOutline = true;
          coinStyle.outlineColor = new Color(96, 42, 8, 255);
          coinStyle.outlineWidth = 2.5;

          // 体力（⚡已烘焙在切图左侧）+ 连胜保护
          var pill = makeSprite('pill_energy', p, 264);
          pill.setPosition(0, yAt(0.406));
          var energy = makeLabel('体力 10/10', 26, new Color(224, 204, 228, 255), pill);
          energy.node.setPosition(26, 0);
          var shield = makeLabel('🛡 连胜保护中', 22, COLORS.gold, p);
          shield.node.setPosition(0, yAt(0.437));
          shield.node.active = false;

          // 补满体力 / 开始游戏
          makeSpriteButton('btn_energy', function () {
            return _this4.onBuyEnergy();
          }, p, 455).setPosition(0, yAt(0.462));
          makeSpriteButton('btn_start', function () {
            return _this4.onStartGame();
          }, p, 490).setPosition(0, yAt(0.558));

          // 2×2 图标导航（图标文字已烘焙）
          makeSpriteButton('btn_signin', function () {
            return _this4.show('signin');
          }, p, 284).setPosition(-147, yAt(0.674));
          makeSpriteButton('btn_rank', function () {
            return _this4.show('rank');
          }, p, 276).setPosition(148, yAt(0.674));
          makeSpriteButton('btn_shop', function () {
            return _this4.show('shop');
          }, p, 282).setPosition(-147, yAt(0.78));
          makeSpriteButton('btn_settings', function () {
            return _this4.show('settings');
          }, p, 258).setPosition(148, yAt(0.78));

          // 战绩：金色文字 + 两侧桂冠（无底板）
          var footerLb = makeLabel('', 22, COLORS.gold, p);
          footerLb.node.name = 'footer';
          footerLb.node.setPosition(0, yAt(0.845));
          var laurelL = makeSprite('laurel_l', p, 32);
          laurelL.setPosition(-120, yAt(0.845));
          var laurelR = makeSprite('laurel_r', p, 32);
          laurelR.setPosition(120, yAt(0.845));

          // 底部装饰：宝箱贴左下角（出血裁切）+ 金币堆
          makeSprite('chest', p, 230).setPosition(-305, yAt(0.963));
          makeSprite('coin_cluster', p, 88).setPosition(302, yAt(0.955));
          makeSprite('coin_stack', p, 42).setPosition(205, yAt(0.972));

          // 两侧散落金币与星光
          var scatter = [['coin_tilt', 40, -330, 0.12], ['coin_flat', 42, 330, 0.185], ['coin_tilt', 34, 324, 0.3], ['coin_flat', 38, -326, 0.38], ['coin_tilt', 38, 306, 0.49], ['coin_flat', 40, -302, 0.62], ['coin_tilt', 36, -322, 0.74], ['sparkle_big', 30, 332, 0.075], ['sparkle_small', 24, -338, 0.26], ['sparkle_big', 26, 340, 0.545], ['sparkle_small', 22, -268, 0.665], ['sparkle_big', 24, 226, 0.126], ['sparkle_small', 18, -234, 0.208], ['sparkle_small', 16, 268, 0.318]];
          for (var _i = 0, _scatter = scatter; _i < _scatter.length; _i++) {
            var _scatter$_i = _scatter[_i],
              sp = _scatter$_i[0],
              w = _scatter$_i[1],
              x = _scatter$_i[2],
              f = _scatter$_i[3];
            makeSprite(sp, p, w).setPosition(x, yAt(f));
          }

          // 右上角声音开关
          this.buildSoundToggle(p, yAt(0.035));
          this.panels.set('home', {
            root: p,
            refresh: function refresh() {
              var w = _this4.app.wallet.state;
              coins.string = formatAmount(w.coins);
              coinGlow.string = coins.string;
              energy.string = "\u4F53\u529B " + w.energy + "/10";
              shield.node.active = _this4.profile.shieldActive;
              _this4.setPanelFooter(footerLb.node, w);
              laurelL.active = laurelR.active = w.totalGames > 0;
            }
          });
        }

        /** 首页底部战绩一行 */;
        _proto.setPanelFooter = function setPanelFooter(footer, w) {
          var label = footer.getComponent(Label);
          if (!label) return;
          var streak = w.winStreak > 0 ? "\u8FDE\u80DC " + w.winStreak : w.loseStreak >= 2 ? "\u8FDE\u8D25 " + w.loseStreak : '';
          label.string = w.totalGames > 0 ? "" + streak + (streak ? ' · ' : '') + "\u7D2F\u8BA1 " + w.totalGames + " \u5C40" : '';
        }

        // ─── 游戏（选箱/开箱） ────────────────────────
        ;

        _proto.buildPlay = function buildPlay() {
          var _this5 = this;
          var p = makePanel('play', this.node);
          var vh = view.getVisibleSize().height;
          var top = vh / 2;
          var yAt = function yAt(fracTop) {
            return vh * (0.5 - fracTop);
          };

          // ── 头区：皇冠横幅 + 立体标题 + 细线菱形 + 状态 + 倒计时胶囊 ──
          makeSprite('divider', p, 210).setPosition(0, yAt(0.028));
          makeSprite('title', p, 380).setPosition(0, yAt(0.085));
          var rule = uiNode('titleRule', p);
          rule.setPosition(0, yAt(0.127));
          var ruleG = rule.addComponent(Graphics);
          ruleG.lineWidth = 2;
          ruleG.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 140);
          ruleG.moveTo(-150, 0);
          ruleG.lineTo(-16, 0);
          ruleG.stroke();
          ruleG.moveTo(16, 0);
          ruleG.lineTo(150, 0);
          ruleG.stroke();
          ruleG.fillColor = COLORS.gold;
          ruleG.moveTo(0, 5);
          ruleG.lineTo(7, 0);
          ruleG.lineTo(0, -5);
          ruleG.lineTo(-7, 0);
          ruleG.close();
          ruleG.fill();
          this.playStatus = makeLabel('', 28, COLORS.white, p);
          this.playStatus.node.setPosition(0, yAt(0.158));
          var cdPill = uiNode('cdPill', p);
          cdPill.setPosition(0, yAt(0.196));
          var cdG = cdPill.addComponent(Graphics);
          cdG.fillColor = new Color(16, 6, 14, 150);
          cdG.roundRect(-155, -24, 310, 48, 24);
          cdG.fill();
          cdG.lineWidth = 1.5;
          cdG.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 90);
          cdG.roundRect(-155, -24, 310, 48, 24);
          cdG.stroke();
          makeLabel('超时自动选箱：', 22, new Color(224, 204, 228, 255), cdPill).node.setPosition(-52, 0);
          this.playTimer = makeLabel('', 32, COLORS.gold, cdPill);
          this.playTimer.node.setPosition(66, 0);
          makeLabel('秒', 22, new Color(224, 204, 228, 255), cdPill).node.setPosition(110, 0);

          // ── 道具按钮（倒计时胶囊两侧；高额保护中时护高按钮隐藏）──
          var itemLowBtn = makeButton('', function () {
            return _this5.onUseRemoveLow();
          }, p, {
            w: 150,
            h: 46,
            fontSize: 21,
            bg: COLORS.nav,
            fg: COLORS.gold,
            border: COLORS.gold
          });
          itemLowBtn.setPosition(-216, yAt(0.196));
          itemLowBtn.name = 'itemLow';
          this.itemLowBtn = itemLowBtn;
          var itemProBtn = makeButton('', function () {
            return _this5.onUseProtectHigh();
          }, p, {
            w: 150,
            h: 46,
            fontSize: 21,
            bg: COLORS.nav,
            fg: COLORS.gold,
            border: COLORS.gold
          });
          itemProBtn.setPosition(216, yAt(0.196));
          itemProBtn.name = 'itemPro';
          this.itemProBtn = itemProBtn;
          this.refreshItemBtns();

          // 右上角声音开关
          this.buildSoundToggle(p, top - 42);

          // ── 4×4 精灵宝箱网格（关态带?锁牌 / 开态抹牌压暗 + 金额）──
          var grid = uiNode('grid', p);
          grid.setPosition(0, yAt(0.458));
          var step = BOX_SIZE + BOX_GAP;
          var _loop = function _loop(i) {
            var col = i % GRID_COLS;
            var row = Math.floor(i / GRID_COLS);
            var x = (col - (GRID_COLS - 1) / 2) * step;
            var y = (1.5 - row) * step;
            var node = uiNode("box_" + i, grid);
            node.getComponent(UITransform).setContentSize(BOX_SIZE, Math.round(BOX_SIZE * 0.89));
            node.setPosition(x, y);
            // 宝箱动画帧：closed（常驻）→ unlocking → open_lid → open_burst → open_settled（开态常驻）
            makeSprite('box_closed', node, BOX_SIZE).name = 'f0';
            makeSprite('box_unlocking', node, BOX_SIZE).name = 'f1';
            makeSprite('box_open_lid', node, BOX_SIZE).name = 'f2';
            makeSprite('box_open_burst', node, BOX_SIZE).name = 'f3';
            makeSprite('box_open_settled', node, BOX_SIZE).name = 'f4';
            for (var _i2 = 0, _arr = [1, 2, 3, 4]; _i2 < _arr.length; _i2++) {
              var fi = _arr[_i2];
              var fn = node.getChildByName("f" + fi);
              if (fn) fn.active = false;
            }
            var spOpen = node.getChildByName('f4');
            var spOpenSprite = spOpen == null ? void 0 : spOpen.getComponent(Sprite);
            if (spOpenSprite) spOpenSprite.color = new Color(126, 106, 120, 255);
            // 自己的宝箱：金色切图帧（选中时替换 f0 显示）
            makeSprite('box_own', node, BOX_SIZE * 1.02).name = 'fOwn';
            node.getChildByName('fOwn').active = false;
            // 金额铭牌（开态显示）
            var plate = makeRect('plate', node, 96, 42, new Color(18, 10, 18, 235), 10);
            plate.setPosition(0, -8);
            plate.active = false;
            var ownRing = uiNode('ownRing', node);
            var ownRingG = ownRing.addComponent(Graphics);
            ownRingG.lineWidth = 3;
            ownRingG.strokeColor = COLORS.gold;
            ownRingG.roundRect(-BOX_SIZE / 2 - 5, -BOX_SIZE * 0.445 - 5, BOX_SIZE + 10, BOX_SIZE * 0.89 + 10, 18);
            ownRingG.stroke();
            ownRing.active = false;
            // 护高锁定标记（🔒）
            var lockIcon = makeLabel('🔒', 20, COLORS.white, node);
            lockIcon.node.setPosition(BOX_SIZE / 2 - 16, BOX_SIZE * 0.445 - 14);
            lockIcon.node.name = 'lockIcon';
            lockIcon.node.active = false;
            // 开箱爆闪光效（金星 + 放射光线）
            var burst = uiNode('burst', node);
            var burstG = burst.addComponent(Graphics);
            burstG.fillColor = new Color(255, 214, 90, 210);
            burstG.circle(0, 0, 44);
            burstG.fill();
            burstG.lineWidth = 6;
            burstG.strokeColor = new Color(255, 236, 160, 220);
            for (var _r = 0; _r < 8; _r++) {
              var _a = _r * Math.PI / 4;
              burstG.moveTo(Math.cos(_a) * 18, Math.sin(_a) * 18);
              burstG.lineTo(Math.cos(_a) * 64, Math.sin(_a) * 64);
              burstG.stroke();
            }
            burst.active = false;
            var label = makeLabel('', 26, COLORS.white, node);
            label.node.setPosition(0, 0);
            label.node.active = false;
            // 深棕描边：爆闪金底和暗箱上都清晰可读
            var lblStyle = label;
            lblStyle.enableOutline = true;
            lblStyle.outlineColor = new Color(42, 16, 10, 255);
            lblStyle.outlineWidth = 1.5;
            node.on(Node.EventType.TOUCH_END, function () {
              return _this5.onBoxClick(i);
            });
            _this5.boxNodes.push({
              node: node,
              label: label,
              index: i
            });
          };
          for (var i = 0; i < TOTAL_BOXES; i++) {
            _loop(i);
          }

          // ── 金额墙：翼饰分区标题 + 金边单元格两排 ──
          var headerY = -top + 356;
          makeLabel('金额墙', 26, COLORS.gold, p).node.setPosition(0, headerY);
          makeSprite('leaf_l', p, 42).setPosition(-64, headerY);
          makeSprite('leaf_r', p, 42).setPosition(64, headerY);
          var wallRule = uiNode('wallRule', p);
          wallRule.setPosition(0, headerY);
          var wg = wallRule.addComponent(Graphics);
          wg.lineWidth = 1.5;
          wg.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 110);
          wg.moveTo(-DESIGN_W / 2 + 24, 0);
          wg.lineTo(-96, 0);
          wg.stroke();
          wg.moveTo(96, 0);
          wg.lineTo(DESIGN_W / 2 - 24, 0);
          wg.stroke();
          this.moneyCells = [];
          BOX_AMOUNTS.forEach(function (amount, i) {
            var row = i < 8 ? 0 : 1;
            var col = i % 8;
            var x = (col - 3.5) * 86;
            var y = -top + (row === 0 ? 318 : 250);
            var cell = makeRect("cell_" + i, p, 82, 42, new Color(24, 12, 28, 190), 10);
            cell.setPosition(x, y);
            var cellG = cell.getComponent(Graphics);
            if (cellG) {
              cellG.lineWidth = 1.5;
              cellG.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 110);
              cellG.roundRect(-41, -21, 82, 42, 10);
              cellG.stroke();
            }
            var lb = makeLabel(formatAmount(amount), 15, COLORS.sub, cell);
            lb.node.setPosition(0, 0);
            _this5.moneyCells.push({
              label: lb,
              value: amount
            });
          });

          // ── 底部圆形舞台（烘焙「点任意箱…」提示胶囊）──
          makeSprite('stage_round', p, 720).setPosition(0, -top + 110);

          // ── 开箱金额全屏展示层：暗幕 + 金光射线 + 大字金额 ──
          var centerFx = uiNode('amountCenter', p);
          var dim = uiNode('dim', centerFx);
          var dimG = dim.addComponent(Graphics);
          dimG.fillColor = new Color(8, 2, 8, 165);
          dimG.rect(-DESIGN_W / 2, -top, DESIGN_W, vh);
          dimG.fill();
          var dimOp = dim.addComponent(UIOpacity);
          dimOp.opacity = 0;
          makeSprite('dome_glow', centerFx, 640).setPosition(0, 20);
          var rays = uiNode('rays', centerFx);
          var raysG = rays.addComponent(Graphics);
          raysG.lineWidth = 5;
          raysG.strokeColor = new Color(255, 226, 130, 120);
          for (var r = 0; r < 12; r++) {
            var a = r * Math.PI * 2 / 12;
            raysG.moveTo(Math.cos(a) * 60, Math.sin(a) * 60);
            raysG.lineTo(Math.cos(a) * 250, Math.sin(a) * 250);
            raysG.stroke();
          }
          var centerLabel = makeLabel('', 84, COLORS.gold, centerFx);
          centerLabel.node.setPosition(0, 20);
          var clStyle = centerLabel;
          clStyle.enableOutline = true;
          clStyle.outlineColor = new Color(88, 26, 6, 255);
          clStyle.outlineWidth = 3;
          // 冲击波光环（序列图 fx_ring）
          var shockRing = makeSprite('fx_ring', centerFx, 260);
          shockRing.setPosition(0, 20);
          var shockRingOp = shockRing.addComponent(UIOpacity);
          shockRingOp.opacity = 0;
          shockRing.active = false;
          centerFx.active = false;
          this.centerFx = centerFx;
          this.centerLabel = centerLabel;
          this.centerDimOp = dimOp;
          this.centerRing = shockRing;
          this.centerRingOp = shockRingOp;

          // ── 银行家来电期间触摸遮挡：覆盖全屏，防止误点箱子 ──
          var blocker = makeRect('gridBlocker', p, DESIGN_W, vh, new Color(0, 0, 0, 0), 0);
          blocker.getComponent(UITransform).setContentSize(DESIGN_W, vh);
          blocker.setPosition(0, 0);
          blocker.on(Node.EventType.TOUCH_END, function () {
            // 吞掉点击，来电期间箱子不可操作
          });
          blocker.active = false;
          this.gridBlocker = blocker;

          // 头部银行家来电横幅：来电即 15 秒倒计时，点击才揭晓报价
          // 来电徽章（右上角圆形倒计时，按效果图样式）
          var ring = makeRect('ring', p, 96, 96, new Color(120, 40, 200, 110), 48);
          ring.setPosition(288, top - 74);
          ring.active = false;
          var _float = makeRect('offerFloat', p, 96, 96, new Color(52, 16, 72, 240), 48);
          _float.setPosition(288, top - 74);
          var fl = makeLabel('☎ 点击', 17, new Color(224, 204, 228, 255), _float);
          fl.node.setPosition(0, 22);
          var cd = makeLabel('15', 38, COLORS.gold, _float);
          cd.node.setPosition(0, -6);
          this.floatCd = cd;
          _float.on(Node.EventType.TOUCH_START, function () {
            return _float.setScale(0.97, 0.97, 1);
          });
          _float.on(Node.EventType.TOUCH_CANCEL, function () {
            return _float.setScale(1, 1, 1);
          });
          _float.on(Node.EventType.TOUCH_END, function () {
            _float.setScale(1, 1, 1);
            _this5.onOfferFloatClick();
          });
          _float.active = false;
          this.offerFloat = _float;
          this.offerFloatRing = ring;
          this.panels.set('play', {
            root: p,
            refresh: function refresh() {
              return _this5.refreshPlay();
            }
          });
        }

        /** 控制银行家来电浮窗显隐（带脉冲提示） */;
        _proto.setOfferFloat = function setOfferFloat(visible) {
          var _this$panels$get9, _this$panels$get10;
          if (!this.offerFloat || !this.offerFloatRing) return;
          this.offerFloat.active = visible;
          this.offerFloatRing.active = visible;
          // 横幅显示时隐藏头区，避免压在标题上
          var play = (_this$panels$get9 = this.panels.get('play')) == null ? void 0 : _this$panels$get9.root;
          if (play) {
            for (var _i3 = 0, _arr2 = ['sp_divider', 'sp_title', 'titleRule']; _i3 < _arr2.length; _i3++) {
              var name = _arr2[_i3];
              var n = play.getChildByName(name);
              if (n) n.active = !visible;
            }
          }
          if (visible) {
            // 来电轻微左右震动
            Tween.stopAllByTarget(this.offerFloat);
            this.offerFloat.angle = 0;
            tween(this.offerFloat).repeat(4, tween(this.offerFloat).to(0.07, {
              angle: 2
            }).to(0.07, {
              angle: -2
            })).to(0.05, {
              angle: 0
            }).start();
          }
          // 来电期间锁定网格：遮挡置顶吞点击 + 网格变暗示意不可操作
          var playPanel = (_this$panels$get10 = this.panels.get('play')) == null ? void 0 : _this$panels$get10.root;
          if (playPanel && this.gridBlocker) {
            var _grid$getComponent;
            var grid = playPanel.getChildByName('grid');
            var gridOp = grid ? (_grid$getComponent = grid.getComponent(UIOpacity)) != null ? _grid$getComponent : grid.addComponent(UIOpacity) : null;
            if (visible) {
              this.gridBlocker.active = true;
              if (gridOp) {
                Tween.stopAllByTarget(gridOp);
                tween(gridOp).to(0.2, {
                  opacity: 90
                }).start();
              }
            } else if (this.gridBlocker.active) {
              this.gridBlocker.active = false;
              if (gridOp) {
                Tween.stopAllByTarget(gridOp);
                tween(gridOp).to(0.2, {
                  opacity: 255
                }).start();
              }
            }
          }
          Tween.stopAllByTarget(this.offerFloatRing);
          if (visible) {
            tween(this.offerFloatRing).repeatForever(tween(this.offerFloatRing).to(0.5, {
              scale: new Vec3(1.09, 1.09, 1)
            }).to(0.5, {
              scale: new Vec3(1, 1, 1)
            })).start();
            this.app.platform.audio.playSfx('open');
          } else {
            this.offerFloatRing.setScale(1, 1, 1);
          }
        }

        /** 点击银行家来电横幅：揭晓报价（倒计时延续，超时自动不成交） */;
        _proto.onOfferFloatClick = function onOfferFloatClick() {
          if (!this.offerWaiting) return;
          this.offerWaiting = false;
          this.setOfferFloat(false);
          this.show('offer');
          this.rollOfferNumber();
        }

        /** 报价数字滚动 → 定格（tween 驱动，随机数向最终报价收敛） */;
        _proto.rollOfferNumber = function rollOfferNumber() {
          var _this6 = this;
          var label = this.offerAmount;
          if (!label) return;
          this.app.platform.audio.playSfx('heartbeat');
          var _final = this.currentOffer;
          var proxy = {
            t: 0
          };
          Tween.stopAllByTarget(proxy);
          tween(proxy).to(0.95, {
            t: 1
          }, {
            onUpdate: function onUpdate() {
              var k = 1 - proxy.t; // 偏离幅度随进度收敛
              var v = Math.max(50, Math.floor(_final * (1 + (Math.random() * 1.2 - 0.5) * k)));
              label.string = "\xA5 " + formatAmount(v);
            }
          }).call(function () {
            label.string = "\xA5 " + formatAmount(_final);
            label.node.setScale(1.28, 1.28, 1);
            tween(label.node).to(0.2, {
              scale: new Vec3(1, 1, 1)
            }, {
              easing: 'backOut'
            }).start();
            _this6.app.platform.audio.playSfx('deal');
          }).start();
        }

        /** 开箱动画：原地逐帧解锁/开盖/爆发，金额铭牌砸出 */;
        _proto.playOpenAnim = function playOpenAnim(boxId, amount) {
          var _this7 = this;
          var box = this.boxNodes.find(function (b) {
            return b.index === boxId;
          });
          if (!box) {
            this.animatingBoxes["delete"](boxId);
            this.refreshPlay();
            return;
          }
          var node = box.node;
          var grid = node.parent;
          var bx = grid ? grid.position.x + node.position.x : 0;
          var by = grid ? grid.position.y + node.position.y : 0;
          var setFrame = function setFrame(idx) {
            for (var f = 0; f <= 4; f++) {
              var fn = node.getChildByName("f" + f);
              if (fn) fn.active = f === idx;
            }
          };
          var big = amount >= 50000;

          // ① 挤压蓄力 + 抖动（解锁闪光帧）
          setFrame(1);
          this.app.platform.audio.playSfx('rumble');
          tween(node).to(0.1, {
            scale: new Vec3(1.1, 0.86, 1)
          }, {
            easing: 'sineIn'
          }).to(0.07, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'sineOut'
          }).to(0.05, {
            angle: 2.5
          }).to(0.05, {
            angle: -2.5
          }).to(0.05, {
            angle: 1.5
          }).to(0.05, {
            angle: -1.5
          }).to(0.04, {
            angle: 0
          }).call(function () {
            // ② 解锁 → 开盖 → 光芒爆发
            _this7.app.platform.audio.playSfx(amount >= 5000 ? 'revealBig' : 'reveal');
            _this7.scheduleOnce(function () {
              return setFrame(2);
            }, 0.16);
            _this7.scheduleOnce(function () {
              setFrame(3);
              _this7.playShockRing(new Vec3(bx, by, 0));
              if (big) _this7.emitGoldBits(bx, by, 14);
            }, 0.3);
            // ③ 稳定帧 + 铭牌金额砸出
            _this7.scheduleOnce(function () {
              setFrame(4);
              var plate = node.getChildByName('plate');
              if (plate) plate.active = true;
              var label = box.label;
              if (label) {
                label.node.active = true;
                label.string = formatAmount(amount);
                label.color = amountColor(amount);
                label.node.setScale(big ? 2.1 : 1.6, big ? 2.1 : 1.6, 1);
                tween(label.node).to(0.2, {
                  scale: new Vec3(1, 1, 1)
                }, {
                  easing: 'backOut'
                }).call(function () {
                  _this7.animatingBoxes["delete"](boxId);
                  if (big) _this7.screenPunch(amount >= 1000000);
                  _this7.refreshPlay();
                }).start();
              } else {
                _this7.animatingBoxes["delete"](boxId);
                _this7.refreshPlay();
              }
            }, 0.5);
          }).start();
        }
        /** 中央冲击波光环（fx_ring） */;
        _proto.playShockRing = function playShockRing(center) {
          var _this$panels$get11;
          var p = (_this$panels$get11 = this.panels.get('play')) == null ? void 0 : _this$panels$get11.root;
          if (!p) return;
          var ring = makeSprite('fx_ring', p, 200);
          ring.setPosition(center.x, center.y);
          var op = ring.addComponent(UIOpacity);
          op.opacity = 240;
          tween(ring).to(0.55, {
            scale: new Vec3(3.4, 3.4, 1)
          }, {
            easing: 'quadOut'
          }).call(function () {
            return ring.destroy();
          }).start();
          tween(op).to(0.55, {
            opacity: 0
          }).start();
        }

        /** 撒金粒子：小金币从指定点四散坠落 */;
        _proto.emitGoldBits = function emitGoldBits(x, y, count) {
          var _this$panels$get12;
          var p = (_this$panels$get12 = this.panels.get('play')) == null ? void 0 : _this$panels$get12.root;
          if (!p) return;
          var _loop2 = function _loop2() {
            var c = makeSprite(Math.random() < 0.5 ? 'coin_tilt' : 'coin_flat', p, 14 + Math.random() * 16);
            c.setPosition(x, y);
            var a = Math.random() * Math.PI * 2;
            var dist = 90 + Math.random() * 150;
            var tx = x + Math.cos(a) * dist;
            var ty = y + Math.sin(a) * dist * 0.7 + 40;
            var fall = ty - 260 - Math.random() * 160;
            var dur = 0.55 + Math.random() * 0.4;
            var op = c.addComponent(UIOpacity);
            tween(c).to(dur * 0.4, {
              position: new Vec3(tx, ty, 0)
            }, {
              easing: 'quadOut'
            }).to(dur * 0.6, {
              position: new Vec3(tx + (Math.random() * 60 - 30), fall, 0)
            }, {
              easing: 'quadIn'
            }).call(function () {
              return c.destroy();
            }).start();
            tween(op).to(dur * 0.75, {
              opacity: 255
            }).to(dur * 0.25, {
              opacity: 0
            }).start();
          };
          for (var i = 0; i < count; i++) {
            _loop2();
          }
        }
        /** 大额揭晓：网格屏震；头奖额外金币雨 */;
        _proto.screenPunch = function screenPunch(withCoinRain) {
          var _this$panels$get13;
          var p = (_this$panels$get13 = this.panels.get('play')) == null ? void 0 : _this$panels$get13.root;
          if (!p) return;
          var grid = p.getChildByName('grid');
          if (grid) {
            Tween.stopAllByTarget(grid);
            var base = grid.position;
            tween(grid).to(0.05, {
              position: new Vec3(base.x + 10, base.y - 6, 0)
            }).to(0.05, {
              position: new Vec3(base.x - 8, base.y + 5, 0)
            }).to(0.05, {
              position: new Vec3(base.x + 5, base.y - 3, 0)
            }).to(0.05, {
              position: new Vec3(base.x, base.y, 0)
            }).start();
          }
          if (withCoinRain) this.coinRain();
        }

        /** 头奖金币雨：金币从屏幕上方洒落 */;
        _proto.coinRain = function coinRain() {
          var _this$panels$get14;
          var p = (_this$panels$get14 = this.panels.get('play')) == null ? void 0 : _this$panels$get14.root;
          if (!p) return;
          var vh = view.getVisibleSize().height;
          var _loop3 = function _loop3() {
            var c = makeSprite('coin_tilt', p, 20 + Math.random() * 24);
            var x = -330 + Math.random() * 660;
            c.setPosition(x, vh / 2 + 40 + Math.random() * 140);
            var op = c.addComponent(UIOpacity);
            var dur = 0.9 + Math.random() * 0.9;
            tween(c).to(dur, {
              position: new Vec3(x + (Math.random() * 140 - 70), -vh / 2 - 60, 0)
            }, {
              easing: 'sineIn'
            }).call(function () {
              return c.destroy();
            }).start();
            tween(op).to(dur * 0.7, {
              opacity: 255
            }).to(dur * 0.3, {
              opacity: 0
            }).start();
          };
          for (var i = 0; i < 26; i++) {
            _loop3();
          }
        };
        _proto.onBoxClick = function onBoxClick(i) {
          var m = this.machine;
          if (!m) return;
          if (m.state === 'PICK_OWN') {
            this.app.platform.audio.playSfx('pick');
            m.pickOwn(i);
          } else if (m.state === 'OPENING') {
            // 点已开的箱 / 自己的宝箱是正常操作，静默忽略（不触发核心错误提示）
            if (this.revealed.has(i) || m.getSnapshot().ownBoxId === i) return;
            m.openBox(i);
          }
        }

        // ─── 对局道具 ─────────────────────────────────

        /** 道具按钮文案与可用态 */;
        _proto.refreshItemBtns = function refreshItemBtns() {
          var m = this.machine;
          var items = this.profile.items;
          var inPlay = !!m && (m.state === 'PICK_OWN' || m.state === 'OPENING');
          var snap = m == null ? void 0 : m.getSnapshot();
          var protectedNow = !!snap && snap.protectedRound === snap.round && snap.round > 0;
          if (this.itemLowBtn) {
            var lb = this.itemLowBtn.getComponentInChildren(Label);
            if (lb) lb.string = "\uD83E\uDDF9 \u53BB\u4F4E\u5238 \xD7" + items.removeLow;
            this.itemLowBtn.active = inPlay && items.removeLow > 0;
          }
          if (this.itemProBtn) {
            var _lb = this.itemProBtn.getComponentInChildren(Label);
            if (_lb) _lb.string = "\uD83D\uDEE1 \u62A4\u9AD8\u5238 \xD7" + items.protectHigh;
            this.itemProBtn.active = inPlay && items.protectHigh > 0 && !protectedNow;
          }
        }

        /** 使用去低券：去掉金额最低的一个箱子 */;
        _proto.onUseRemoveLow = function onUseRemoveLow() {
          var m = this.machine;
          if (!m || !this.profile.consumeItem('removeLow')) return;
          var id = m.eliminateLowest();
          if (id === null) {
            // 核心拒绝（状态不允许）→ 退还
            this.profile.addItem('removeLow');
            this.toast('当前无法使用去低券');
            return;
          }
          this.refreshItemBtns();
        }

        /** 使用护高券：本轮高金额受保护并洗牌剩余箱子 */;
        _proto.onUseProtectHigh = function onUseProtectHigh() {
          var m = this.machine;
          if (!m || !this.profile.consumeItem('protectHigh')) return;
          var ok = m.activateProtectHigh();
          if (!ok) {
            this.profile.addItem('protectHigh');
            this.toast('当前无法使用护高券');
            return;
          }
          // 洗牌后重绘全部未开箱（位置互换，动画表现跳一下即可）
          this.refreshPlay();
          this.refreshItemBtns();
        }

        /** 自己的宝箱轻微脉动 */;
        _proto.setPulse = function setPulse(node) {
          if (this.pulseTarget === node) return;
          if (this.pulseTarget) {
            Tween.stopAllByTarget(this.pulseTarget);
            this.pulseTarget.setScale(1, 1, 1);
          }
          this.pulseTarget = node;
          if (node) {
            tween(node).repeatForever(tween(node).to(0.55, {
              scale: new Vec3(1.045, 1.045, 1)
            }).to(0.55, {
              scale: new Vec3(1, 1, 1)
            })).start();
          }
        };
        _proto.refreshPlay = function refreshPlay() {
          var m = this.machine;
          if (!m) return;
          var snap = m.getSnapshot();
          if (this.playStatus) {
            if (snap.state === 'PICK_OWN') this.playStatus.string = '请选择你的宝箱';else if (snap.state === 'OPENING') {
              this.playStatus.string = "\u7B2C " + snap.round + "/6 \u8F6E \xB7 \u672C\u8F6E\u8FD8\u53EF\u5F00 " + Math.max(0, this.roundToOpen - this.roundOpened) + " \u7BB1";
            } else this.playStatus.string = '';
          }
          if (this.playTimer) {
            this.playTimer.node.parent.active = snap.state === 'PICK_OWN' && this.pickLeft > 0;
            this.playTimer.string = snap.state === 'PICK_OWN' && this.pickLeft > 0 ? "" + Math.ceil(this.pickLeft) : '';
          }
          var ownNode = null;
          var lockedActive = snap.protectedRound === snap.round && snap.round > 0;
          for (var _iterator3 = _createForOfIteratorHelperLoose(this.boxNodes), _step3; !(_step3 = _iterator3()).done;) {
            var box = _step3.value;
            if (this.animatingBoxes.has(box.index)) continue; // 开箱动画进行中，保持现状
            var own = snap.ownBoxId === box.index;
            var opened = this.revealed.has(box.index);
            var amount = snap.boxAmounts[box.index];
            var locked = lockedActive && snap.protectedAmounts.includes(amount);
            var spClosed = box.node.getChildByName('f0');
            var spOpen = box.node.getChildByName('f4');
            var ownRing = box.node.getChildByName('ownRing');
            var lockIcon = box.node.getChildByName('lockIcon');
            if (lockIcon) lockIcon.active = locked && !opened && !own;
            var fOwn = box.node.getChildByName('fOwn');
            if (spClosed && spOpen && ownRing) {
              // 开态（f4）压暗常驻；关态（f0）正常；己方箱显示金色帧
              spClosed.active = !opened && !own;
              if (fOwn) fOwn.active = own && !opened;
              spOpen.active = opened;
              ownRing.active = false;
            }
            if (box.label) {
              box.label.node.active = opened;
              if (opened) {
                box.label.string = formatAmount(amount);
                box.label.color = amountColor(amount);
              }
            }
            if (own && !opened) ownNode = box.node;
          }
          this.setPulse(ownNode);

          // 金额墙：已揭示的金额置灰
          var revealedSet = new Set(this.revealed.values());
          for (var _iterator4 = _createForOfIteratorHelperLoose(this.moneyCells), _step4; !(_step4 = _iterator4()).done;) {
            var cell = _step4.value;
            var hit = revealedSet.has(cell.value);
            cell.label.color = hit ? new Color(120, 105, 140, 120) : amountColor(cell.value);
          }
          this.refreshItemBtns();
        }

        // ─── 银行家报价 ───────────────────────────────
        ;

        _proto.buildOffer = function buildOffer() {
          var _this8 = this;
          // 按新效果图做可视高度百分比布局：暗底紫光束金纸屑、金边卡片+皇冠、
          // 切角金额牌匾、倒计时胶囊、带圆形图标的描边按钮、底部保障行与提示行
          var p = makePanel('offer', this.node, false);
          var vh = view.getVisibleSize().height;
          var yAt = function yAt(fracTop) {
            return vh * (0.5 - fracTop);
          };
          var GOLD = new Color(244, 205, 105, 255);
          var CARD_TOP = yAt(0.134);
          var CARD_BOT = yAt(0.873);
          var CARD_W = 600;

          // ── 背景：近黑底 + 紫色聚光光束 + 金色纸屑 ──
          var bg = uiNode('offerBg', p);
          var bgg = bg.addComponent(Graphics);
          bgg.fillColor = new Color(10, 8, 24, 235);
          bgg.rect(-DESIGN_W / 2, -vh / 2, DESIGN_W, vh);
          bgg.fill();
          bgg.fillColor = new Color(126, 98, 224, 34);
          var beam = function beam(tx1, tx2, bx, by) {
            bgg.moveTo(tx1, vh / 2);
            bgg.lineTo(tx2, vh / 2);
            bgg.lineTo(bx, by);
            bgg.close();
            bgg.fill();
          };
          beam(-DESIGN_W / 2, -DESIGN_W * 0.2, -DESIGN_W * 0.36, -vh * 0.16);
          beam(DESIGN_W / 2, DESIGN_W * 0.2, DESIGN_W * 0.36, -vh * 0.16);
          bgg.fillColor = new Color(126, 98, 224, 22);
          beam(-DESIGN_W * 0.18, DESIGN_W * 0.04, -DESIGN_W * 0.16, -vh * 0.1);
          beam(DESIGN_W * 0.18, -DESIGN_W * 0.04, DESIGN_W * 0.16, -vh * 0.1);
          for (var i = 0; i < 26; i++) {
            var cx = (i * 173 % 1000 / 1000 - 0.5) * (DESIGN_W - 40);
            var cy = (i * 389 % 1000 / 1000 - 0.5) * vh * 0.94;
            var a = i * 0.7;
            var w = 5 + i % 3 * 3;
            var h = 10 + i % 4 * 4;
            var c = Math.cos(a);
            var s = Math.sin(a);
            var corners = [[-w / 2, -h / 2], [w / 2, -h / 2], [w / 2, h / 2], [-w / 2, h / 2]];
            bgg.fillColor = new Color(244, 205, 105, 80 + i % 3 * 40);
            bgg.moveTo(cx + corners[0][0] * c - corners[0][1] * s, cy + corners[0][0] * s + corners[0][1] * c);
            for (var k = 1; k < 4; k++) bgg.lineTo(cx + corners[k][0] * c - corners[k][1] * s, cy + corners[k][0] * s + corners[k][1] * c);
            bgg.close();
            bgg.fill();
          }

          // ── 金边圆角卡片 ──
          var card = uiNode('offerCard', p);
          var cg = card.addComponent(Graphics);
          cg.fillColor = new Color(43, 34, 74, 255);
          cg.roundRect(-CARD_W / 2, CARD_BOT, CARD_W, CARD_TOP - CARD_BOT, 30);
          cg.fill();
          cg.lineWidth = 2.5;
          cg.strokeColor = new Color(244, 205, 105, 165);
          cg.roundRect(-CARD_W / 2, CARD_BOT, CARD_W, CARD_TOP - CARD_BOT, 30);
          cg.stroke();

          // ── 元素使用切好的精灵图（assets/resources/ui/banker_*.png） ──
          makeSprite('banker_crown', p, 132).setPosition(0, CARD_TOP + 16);

          // 电话图标 + 金色标题
          var titleY = yAt(0.205);
          makeSprite('banker_phone', p, 52).setPosition(-120, titleY);
          makeSprite('banker_title', p, 232).setPosition(30, titleY);

          // 头像：靛蓝圆底金环 $ 精灵
          makeSprite('banker_dollar', p, 128).setPosition(0, yAt(0.302));

          // "银行家" 金字 + 两侧金线菱形饰 精灵
          makeSprite('banker_label', p, 300).setPosition(0, yAt(0.386));

          // 报价语精灵（原图偏小，适度放大）
          makeSprite('banker_quote', p, 360).setPosition(0, yAt(0.428));

          // ── 金额牌匾：切角金边精灵 + 动态金额文字 ──
          var plaque = makeSprite('banker_amount_bg', p, 548);
          plaque.setPosition(0, yAt(0.525));
          this.offerAmount = makeLabel('', 92, GOLD, plaque);
          this.offerAmount.node.setPosition(0, 0);

          // ── 倒计时胶囊：精灵底 + 时钟精灵 + 灰字 + 紫色动态数字 ──
          var pill = makeSprite('banker_timer_bg', p, 420);
          pill.setPosition(0, yAt(0.636));
          makeSprite('banker_clock', pill, 34).setPosition(-168, 0);
          makeLabel('超时自动不成交：', 26, new Color(196, 190, 215, 255), pill).node.setPosition(-30, 0);
          this.offerTimer = makeLabel('', 30, new Color(167, 139, 250, 255), pill);
          this.offerTimer.node.setPosition(150, 0);
          makeLabel('秒', 26, new Color(196, 190, 215, 255), pill).node.setPosition(184, 0);

          // ── 整图按钮（含图标与文字） ──
          makeSpriteButton('banker_accept_btn', function () {
            var _this8$machine;
            return (_this8$machine = _this8.machine) == null ? void 0 : _this8$machine.decide(true);
          }, p, 256).setPosition(-140, yAt(0.726));
          makeSpriteButton('banker_continue_btn', function () {
            var _this8$machine2;
            return (_this8$machine2 = _this8.machine) == null ? void 0 : _this8$machine2.decide(false);
          }, p, 256).setPosition(140, yAt(0.726));

          // ── 卡片下方提示行（看广告加价按钮显示时让位） ──
          var footer = uiNode('offerFooter', p);
          footer.setPosition(0, yAt(0.928));
          makeSprite('banker_footer', footer, 230).setPosition(0, 0);
          makeSprite('banker_bottom_deco', footer, 150).setPosition(-192, 0);
          var decoR = makeSprite('banker_bottom_deco', footer, 150);
          decoR.setPosition(192, 0);
          decoR.setScale(-1, 1, 1);
          this.offerFooter = footer;
          this.offerRaiseBtn = makeButton('看广告 · 银行家加价 +15%', function () {
            return _this8.onRaiseOffer();
          }, p, {
            w: 420,
            h: 76,
            fontSize: 26
          });
          this.offerRaiseBtn.setPosition(0, yAt(0.928));
          this.panels.set('offer', {
            root: p,
            refresh: function refresh() {
              return _this8.refreshOffer();
            }
          });
        };
        _proto.refreshOffer = function refreshOffer() {
          if (this.offerAmount) this.offerAmount.string = "\xA5 " + formatAmount(this.currentOffer);
          if (this.offerRaiseBtn) {
            var showAd = this.profile.adsEnabled && canShowRewarded(this.profile.ads, 'banker_raise');
            this.offerRaiseBtn.active = showAd;
            if (this.offerFooter) this.offerFooter.active = !showAd;
          }
        };
        _proto.onRaiseOffer = function onRaiseOffer() {
          var _this9 = this;
          this.tryRewarded('banker_raise', function () {
            var _this9$machine;
            var raised = (_this9$machine = _this9.machine) == null ? void 0 : _this9$machine.raiseCurrentOffer();
            if (raised != null) {
              var _this9$panels$get;
              _this9.currentOffer = raised;
              _this9.toast("\u94F6\u884C\u5BB6\u52A0\u4EF7\u5230 \uFFE5" + formatAmount(raised));
              (_this9$panels$get = _this9.panels.get('offer')) == null || _this9$panels$get.refresh();
            }
          });
        }

        // ─── 终局二选一 ───────────────────────────────
        ;

        _proto.buildFinalTwo = function buildFinalTwo() {
          var _this10 = this;
          var p = makePanel('finalTwo', this.node);
          makeTitle('终局二选一', p, 488, 52);
          makeLabel('只剩你的宝箱和另一个未开的宝箱', 28, COLORS.sub, p).node.setPosition(0, 404);
          makeLabel('换，还是不换？', 34, COLORS.white, p).node.setPosition(0, 324);
          makeButton('不换 · 坚持我的宝箱', function () {
            var _this10$machine;
            return (_this10$machine = _this10.machine) == null ? void 0 : _this10$machine.chooseFinal(false);
          }, p, {
            w: 520,
            h: 110,
            fontSize: 34,
            bg: COLORS.nav,
            fg: COLORS.white
          }).setPosition(0, 118);
          makeButton('换 · 选另一个宝箱', function () {
            var _this10$machine2;
            return (_this10$machine2 = _this10.machine) == null ? void 0 : _this10$machine2.chooseFinal(true);
          }, p, {
            w: 520,
            h: 110,
            fontSize: 34
          }).setPosition(0, -42);
          var lastOffer = makeLabel('', 26, COLORS.sub, p);
          lastOffer.node.setPosition(0, -205);
          this.panels.set('finalTwo', {
            root: p,
            refresh: function refresh() {
              lastOffer.string = "\u6700\u540E\u62A5\u4EF7 \uFFE5" + formatAmount(_this10.currentOffer);
            }
          });
        }

        // ─── 揭晓 ─────────────────────────────────────
        ;

        _proto.buildRevealOverlay = function buildRevealOverlay() {
          var p = uiNode('revealOverlay', this.node);
          var vw = view.getVisibleSize().width;
          var vh = view.getVisibleSize().height;
          p.getComponent(UITransform).setContentSize(vw, vh);
          var w = p.addComponent(Widget);
          w.isAlignTop = true;
          w.isAlignBottom = true;
          w.isAlignLeft = true;
          w.isAlignRight = true;
          w.top = 0;
          w.bottom = 0;
          w.left = 0;
          w.right = 0;
          var g = p.addComponent(Graphics);
          g.fillColor = new Color(0, 0, 0, 205);
          g.rect(-vw / 2, -vh / 2, vw, vh);
          g.fill();
          // 金色边框 + 放射线
          g.lineWidth = 4;
          g.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 220);
          g.roundRect(-vw / 2 + 36, -vh / 2 + 36, vw - 72, vh - 72, 24);
          g.stroke();
          g.lineWidth = 3;
          g.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 110);
          for (var i = 0; i < 12; i++) {
            var a1 = Math.PI * 2 * i / 12;
            var a2 = a1 + Math.PI / 24;
            g.moveTo(Math.cos(a1) * 130, Math.sin(a1) * 130 - 60);
            g.lineTo(Math.cos(a2) * 460, Math.sin(a2) * 460 - 60);
          }
          g.stroke();
          this.revealOwn = makeLabel('', 40, COLORS.white, p);
          this.revealOwn.node.setPosition(0, 120);
          this.revealFinal = makeLabel('', 56, COLORS.gold, p);
          this.revealFinal.node.setPosition(0, 0);
          p.active = false;
          this.revealOverlay = p;
        };
        _proto.showReveal = function showReveal(e) {
          var _this11 = this;
          if (!this.revealOverlay) return;
          if (this.revealOwn) this.revealOwn.string = "\u4F60\u7684\u5B9D\u7BB1\uFF1A\uFFE5" + formatAmount(e.ownAmount);
          if (this.revealFinal) {
            this.revealFinal.string = e.swapped ? "\u6362\u7BB1\u83B7\u5F97\uFF1A\uFFE5" + formatAmount(e.finalAmount) : "\u6700\u7EC8\u6240\u5F97\uFF1A\uFFE5" + formatAmount(e.finalAmount);
          }
          this.revealOverlay.active = true;
          this.scheduleOnce(function () {
            var _this11$machine;
            if (_this11.revealOverlay) _this11.revealOverlay.active = false;
            (_this11$machine = _this11.machine) == null || _this11$machine.completeReveal();
          }, 1.8);
        }

        // ─── 结算 ─────────────────────────────────────
        ;

        _proto.buildSettle = function buildSettle() {
          var _this12 = this;
          var p = makePanel('settle', this.node);
          makeTitle('本局结算', p, 560, 52);
          var result = makeLabel('', 44, COLORS.gold, p);
          result.node.setPosition(0, 442);
          var detail = makeLabel('', 28, COLORS.white, p);
          detail.node.setPosition(0, 235);
          var coins = makeLabel('', 26, COLORS.sub, p);
          coins.node.setPosition(0, -25);
          var doubleBtn = makeButton('看广告 · 所得 +50%', function () {
            return _this12.onSettleDouble();
          }, p, {
            w: 420,
            h: 84,
            fontSize: 28
          });
          doubleBtn.setPosition(0, -168);
          var compBtn = makeButton('看广告 · 补偿 +50%', function () {
            return _this12.onCompDouble();
          }, p, {
            w: 420,
            h: 84,
            fontSize: 28,
            bg: COLORS.nav,
            fg: COLORS.white
          });
          compBtn.setPosition(0, -278);
          makeButton('再来一局', function () {
            return _this12.onStartGame();
          }, p, {
            w: 300
          }).setPosition(-170, -420);
          makeButton('返回首页', function () {
            return _this12.onBackHome();
          }, p, {
            w: 300,
            bg: COLORS.nav,
            fg: COLORS.white
          }).setPosition(170, -420);
          this.panels.set('settle', {
            root: p,
            refresh: function refresh() {
              var r = _this12.settleRecord;
              var res = _this12.settleResult;
              if (!r || !res) return;
              result.string = r.wonBanker ? '🏆 赢了银行家！' : '银行家获胜，再接再厉';
              var lines = [r.dealt ? "\u6210\u4EA4\u5151\u73B0 \uFFE5" + formatAmount(r.dealAmount) : '坚持到终局揭晓', "\u6700\u540E\u62A5\u4EF7\uFF1A\uFFE5" + formatAmount(r.finalOffer), "\u6700\u7EC8\u6240\u5F97\uFF1A\uFFE5" + formatAmount(r.finalAmount), "\u4F60\u7684\u5B9D\u7BB1\u5B9E\u9645\u91D1\u989D\uFF1A\uFFE5" + formatAmount(r.ownAmount)];
              detail.string = lines.join('\n');
              var extras = ["\u6240\u5F97 +" + formatAmount(r.finalAmount), res.streakReward > 0 ? "\u8FDE\u80DC\u5956\u52B1 +" + formatAmount(res.streakReward) : null, res.loseCompensation > 0 ? "\u8FDE\u8D25\u8865\u507F +" + formatAmount(res.loseCompensation) : null].filter(Boolean);
              var w = _this12.app.wallet.state;
              coins.string = extras.join('　') + "\n\u5F53\u524D\u91D1\u5E01 " + formatAmount(w.coins) + " \xB7 \u8FDE\u80DC " + w.winStreak + " \xB7 \u8FDE\u8D25 " + w.loseStreak;
              doubleBtn.active = _this12.profile.adsEnabled && !_this12.settleDoubled && canShowRewarded(_this12.profile.ads, 'settle_double');
              compBtn.active = _this12.profile.adsEnabled && res.loseCompensation > 0 && !_this12.compDoubled && canShowRewarded(_this12.profile.ads, 'lose_comp_double');
            }
          });
        };
        _proto.onSettleDouble = function onSettleDouble() {
          var _this13 = this;
          if (!this.settleRecord) return;
          this.tryRewarded('settle_double', function () {
            var _this13$panels$get;
            _this13.settleDoubled = true;
            var extra = Math.floor(_this13.settleRecord.finalAmount / 2);
            _this13.app.wallet.grantCoins(extra);
            _this13.toast("\u6240\u5F97 +50% +" + formatAmount(extra));
            (_this13$panels$get = _this13.panels.get('settle')) == null || _this13$panels$get.refresh();
          });
        };
        _proto.onCompDouble = function onCompDouble() {
          var _this14 = this;
          if (!this.settleResult) return;
          this.tryRewarded('lose_comp_double', function () {
            var _this14$panels$get;
            _this14.compDoubled = true;
            var extra = Math.floor(_this14.settleResult.loseCompensation / 2);
            _this14.app.wallet.grantCoins(extra);
            _this14.toast("\u8865\u507F +50% +" + formatAmount(extra));
            (_this14$panels$get = _this14.panels.get('settle')) == null || _this14$panels$get.refresh();
          });
        }

        // ─── 签到 ─────────────────────────────────────
        ;

        _proto.buildSignin = function buildSignin() {
          var _this15 = this;
          var p = makePanel('signin', this.node, false);
          var vh = view.getVisibleSize().height;
          var yAt = function yAt(fracTop) {
            return vh * (0.5 - fracTop);
          };
          var GOLD = COLORS.gold;
          var capsule = function capsule(n, w, h, fill, border, lw) {
            n.getComponent(UITransform).setContentSize(w, h);
            var g = n.addComponent(Graphics);
            g.fillColor = fill;
            g.roundRect(-w / 2, -h / 2, w, h, h / 2);
            g.fill();
            g.lineWidth = lw;
            g.strokeColor = border;
            g.roundRect(-w / 2, -h / 2, w, h, h / 2);
            g.stroke();
          };

          // 标题（麦穗版）+ 副标题
          makeSprite('signin_title2', p, 360).setPosition(0, yAt(0.068));
          makeLabel('连续签到 7 天循环奖励', 28, GOLD, p).node.setPosition(0, yAt(0.17));

          // 7 行奖励：金边暗胶囊 + 天数胶囊 + 单枚金币 + 金额 + 状态；第7天右侧发光宝箱探出
          var ROW_W = 640;
          var ROW_H = 62;
          var rowNodes = [];
          for (var i = 0; i < 7; i++) {
            var isLast = i === 6;
            var row = uiNode("signinRow" + i, p);
            capsule(row, ROW_W, ROW_H, new Color(38, 20, 66, 210), new Color(255, 201, 60, isLast ? 255 : 120), isLast ? 3 : 2);
            row.setPosition(0, yAt(0.208) - i * 70);
            var pill = uiNode('pill', row);
            capsule(pill, 128, 40, new Color(24, 12, 44, 235), new Color(255, 201, 60, 200), 2);
            makeLabel("\u7B2C " + (i + 1) + " \u5929", 24, GOLD, pill).node.setPosition(0, 1);
            pill.setPosition(-238, 0);
            makeSprite('signin_coin', row, 46).setPosition(-128, 0);
            makeLabel(formatAmount(SIGNIN_REWARDS[i]), isLast ? 38 : 32, isLast ? GOLD : COLORS.white, row).node.setPosition(isLast ? 10 : 30, 0);
            var chest = isLast ? makeSprite('signin_chest_glow', row, 132) : null;
            if (chest) chest.setPosition(240, -12);
            var claimed = makeSprite('signin_stamp_claimed', row, 78);
            claimed.setPosition(230, 0);
            var claimable = uiNode('claimable', row);
            capsule(claimable, 110, 40, GOLD, GOLD, 0);
            makeLabel('可领取', 24, COLORS.goldText, claimable).node.setPosition(0, 1);
            claimable.setPosition(230, 0);
            var pending = makeLabel('待签到', 24, COLORS.sub, row).node;
            pending.setPosition(232, 0);
            rowNodes.push({
              claimed: claimed,
              claimable: claimable,
              pending: pending,
              chest: chest != null ? chest : undefined
            });
          }
          var state = makeLabel('', 26, COLORS.sub, p);
          state.node.setPosition(0, yAt(0.60));
          var signBtn = makeSpriteButton('signin_btn_sign', function () {
            return _this15.onSignin();
          }, p, 360);
          signBtn.setPosition(0, yAt(0.668));
          var doneBtn = makeSprite('signin_btn_done', p, 360);
          doneBtn.setPosition(0, yAt(0.668));
          // 看广告按钮常驻：可加成时亮色，否则暗色（对齐设计图）
          var adBtn = makeSpriteButton('signin_btn_ad', function () {
            return _this15.onSigninDouble();
          }, p, 470);
          adBtn.setPosition(0, yAt(0.742));
          var adBtnDim = makeSprite('signin_btn_ad_dim', p, 470);
          adBtnDim.setPosition(0, yAt(0.742));
          makeButton('←  返回', function () {
            return _this15.show('home');
          }, p, {
            w: 210,
            h: 58,
            bg: new Color(24, 12, 44, 235),
            fg: GOLD,
            border: new Color(255, 201, 60, 200),
            fontSize: 26
          }).setPosition(0, yAt(0.838));

          // 底部装饰：左右金币堆（设计图两侧均为金币，左为镜像）
          var coinsL = makeSprite('signin_coins_corner', p, 260);
          coinsL.setScale(-1, 1, 1);
          coinsL.setPosition(-240, yAt(0.948));
          makeSprite('signin_coins_corner', p, 300).setPosition(248, yAt(0.946));
          this.panels.set('signin', {
            root: p,
            refresh: function refresh() {
              var st = _this15.app.wallet.signinState;
              var today = dateKey(Date.now());
              var signedToday = st.lastSigninDate === today;
              // 循环周期内：已领到第 lastClaimed 天，未签到时下一天可领
              var lastClaimed = st.streakDays > 0 ? (st.streakDays - 1) % 7 : -1;
              var claimableIdx = signedToday ? -1 : (lastClaimed + 1) % 7;
              rowNodes.forEach(function (r, i) {
                var done = i <= lastClaimed;
                var ready = i === claimableIdx;
                r.claimed.active = done;
                r.claimable.active = ready;
                r.pending.active = !done && !ready && !r.chest;
                // 第7天：常态显示发光宝箱，被状态印章/胶囊占用时让位
                if (r.chest) r.chest.active = !done && !ready;
              });
              state.string = signedToday ? "\u5DF2\u8FDE\u7EED\u7B7E\u5230 " + st.streakDays + " \u5929\uFF0C\u660E\u5929\u7EE7\u7EED\uFF01" : '签到领金币，连续 7 天循环奖励';
              signBtn.active = !signedToday;
              doneBtn.active = signedToday;
              var adReady = _this15.profile.adsEnabled && signedToday && _this15.signinBase > 0 && canShowRewarded(_this15.profile.ads, 'signin_double');
              adBtn.active = adReady;
              adBtnDim.active = !adReady;
            }
          });
        };
        _proto.onSignin = function onSignin() {
          var _this$panels$get15;
          var claimed = this.app.wallet.signin();
          if (!claimed) {
            this.toast('今天已签到');
            return;
          }
          this.signinBase = claimed.reward;
          this.toast("\u7B7E\u5230\u6210\u529F +" + formatAmount(claimed.reward));
          (_this$panels$get15 = this.panels.get('signin')) == null || _this$panels$get15.refresh();
        };
        _proto.onSigninDouble = function onSigninDouble() {
          var _this16 = this;
          if (this.signinBase <= 0) return;
          this.tryRewarded('signin_double', function () {
            var _this16$panels$get;
            var extra = Math.floor(_this16.signinBase / 2);
            _this16.app.wallet.grantCoins(extra);
            _this16.toast("\u4ECA\u65E5\u5956\u52B1 +50% +" + formatAmount(extra));
            _this16.signinBase = 0;
            (_this16$panels$get = _this16.panels.get('signin')) == null || _this16$panels$get.refresh();
          });
        }

        // ─── 排行榜 ───────────────────────────────────
        ;

        _proto.buildRank = function buildRank() {
          var _this17 = this;
          var p = makePanel('rank', this.node);
          makeTitle('本地排行榜', p, 560, 52);
          var stats = makeLabel('', 28, COLORS.gold, p);
          stats.node.setPosition(0, 448);
          var list = makeLabel('', 26, COLORS.white, p);
          list.node.setPosition(0, 20);
          makeButton('返回', function () {
            return _this17.show('home');
          }, p, {
            w: 240,
            bg: COLORS.nav,
            fg: COLORS.white
          }).setPosition(0, -540);
          this.panels.set('rank', {
            root: p,
            refresh: function refresh() {
              var w = _this17.app.wallet.state;
              var rate = w.totalGames > 0 ? Math.round(w.totalWins / w.totalGames * 100) : 0;
              stats.string = "\u603B\u5C40\u6570 " + w.totalGames + " \xB7 \u80DC\u7387 " + rate + "% \xB7 \u6700\u9AD8\u5355\u5C40 \uFFE5" + formatAmount(w.highestSingle);
              var top = _this17.profile.top10();
              list.string = top.length ? top.map(function (r, i) {
                var how = r.dealt ? '成交' : r.swapped ? '换箱' : '坚持';
                return i + 1 + ". \uFFE5" + formatAmount(r.finalAmount) + "  " + how + "  " + (r.wonBanker ? '胜' : '负');
              }).join('\n') : '还没有记录，快去开一局！';
            }
          });
        }

        // ─── 商店 ─────────────────────────────────────
        ;

        _proto.buildShop = function buildShop() {
          var _this18 = this;
          var p = makePanel('shop', this.node);
          makeTitle('商店', p, 560, 52);
          var coins = makeLabel('', 36, COLORS.gold, p);
          coins.node.setPosition(0, 478);

          // 实用道具：去低券 / 护高券
          makeLabel('🧹 去低券', 26, COLORS.white, p).node.setPosition(-165, 402);
          makeLabel('立即去掉场上金额最低的箱子（不占开箱数）', 19, COLORS.sub, p).node.setPosition(-165, 374);
          var lowItemBtn = makeButton('', function () {
            return _this18.onBuyRemoveLow();
          }, p, {
            w: 264,
            h: 56,
            fontSize: 22
          });
          lowItemBtn.setPosition(-165, 330);
          makeLabel('🛡 护高券', 26, COLORS.white, p).node.setPosition(165, 402);
          makeLabel('本轮高金额箱上锁，未开箱重新洗牌', 19, COLORS.sub, p).node.setPosition(165, 374);
          var proItemBtn = makeButton('', function () {
            return _this18.onBuyProtectHigh();
          }, p, {
            w: 264,
            h: 56,
            fontSize: 22
          });
          proItemBtn.setPosition(165, 330);

          // 连胜护盾
          makeLabel('🛡 连胜护盾', 34, COLORS.white, p).node.setPosition(0, 268);
          makeLabel('输给银行家时自动生效，保留当前连胜（一次性）', 22, COLORS.sub, p).node.setPosition(0, 234);
          var shieldBtn = makeButton('', function () {
            return _this18.onBuyShield();
          }, p, {
            w: 360,
            h: 64,
            fontSize: 26
          });
          shieldBtn.setPosition(0, 180);
          makeButton('返回', function () {
            return _this18.show('home');
          }, p, {
            w: 240,
            bg: COLORS.nav,
            fg: COLORS.white
          }).setPosition(0, -324);
          this.panels.set('shop', {
            root: p,
            refresh: function refresh() {
              coins.string = "\u91D1\u5E01 " + formatAmount(_this18.app.wallet.state.coins);
              var lowLabel = lowItemBtn.getComponentInChildren(Label);
              if (lowLabel) lowLabel.string = "\u8D2D\u4E70 \xB7 " + formatAmount(ITEM_REMOVE_LOW_PRICE) + " \u91D1\u5E01";
              var proLabel = proItemBtn.getComponentInChildren(Label);
              if (proLabel) proLabel.string = "\u8D2D\u4E70 \xB7 " + formatAmount(ITEM_PROTECT_HIGH_PRICE) + " \u91D1\u5E01";
              var shieldLabel = shieldBtn.getComponentInChildren(Label);
              if (shieldLabel) {
                shieldLabel.string = _this18.profile.shieldActive ? '使用中' : "\u8D2D\u4E70 \xB7 " + formatAmount(SHIELD_PRICE) + " \u91D1\u5E01";
              }
            }
          });
        }

        // ─── 设置 ─────────────────────────────────────
        ;

        _proto.buildSettings = function buildSettings() {
          var _this19 = this;
          var p = makePanel('settings', this.node);
          makeTitle('设置', p, 560, 52);
          var soundBtn = makeButton('', function () {
            return _this19.toggleSound();
          }, p, {
            w: 340
          });
          soundBtn.setPosition(0, 344);
          makeButton('重置本地数据', function () {
            return _this19.onReset();
          }, p, {
            w: 340,
            bg: COLORS.red,
            fg: COLORS.white
          }).setPosition(0, 204);
          makeLabel('金币为游戏内虚拟道具，不可兑换现金。', 24, COLORS.sub, p).node.setPosition(0, -64);
          makeLabel('千金一箱 goldenbox v0.1.0', 22, COLORS.sub, p).node.setPosition(0, -124);
          makeButton('返回', function () {
            return _this19.show('home');
          }, p, {
            w: 240,
            bg: COLORS.nav,
            fg: COLORS.white
          }).setPosition(0, -324);
          this.panels.set('settings', {
            root: p,
            refresh: function refresh() {
              var label = soundBtn.getComponentInChildren(Label);
              if (label) label.string = _this19.profile.muted ? '音效：关' : '音效：开';
            }
          });
        };
        _proto.toggleSound = function toggleSound() {
          var _this$panels$get16;
          var muted = !this.profile.muted;
          this.profile.setMuted(muted);
          this.app.platform.audio.setMuted(muted);
          for (var _iterator5 = _createForOfIteratorHelperLoose(this.soundBtnLabels), _step5; !(_step5 = _iterator5()).done;) {
            var lb = _step5.value;
            lb.string = muted ? '🔇' : '🔊';
          }
          (_this$panels$get16 = this.panels.get('settings')) == null || _this$panels$get16.refresh();
        }

        /** 页面右上角圆形声音开关（首页/开箱页各一） */;
        _proto.buildSoundToggle = function buildSoundToggle(parent, y) {
          var _this20 = this;
          var btn = makeRect('soundToggle', parent, 62, 62, new Color(16, 6, 14, 150), 31);
          btn.setPosition(302, y);
          var g = btn.getComponent(Graphics);
          if (g) {
            g.lineWidth = 1.5;
            g.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 90);
            g.roundRect(-31, -31, 62, 62, 31);
            g.stroke();
          }
          var lb = makeLabel(this.profile.muted ? '🔇' : '🔊', 26, COLORS.white, btn);
          lb.node.setPosition(0, 1);
          this.soundBtnLabels.push(lb);
          btn.on(Node.EventType.TOUCH_START, function () {
            return btn.setScale(0.92, 0.92, 1);
          });
          btn.on(Node.EventType.TOUCH_CANCEL, function () {
            return btn.setScale(1, 1, 1);
          });
          btn.on(Node.EventType.TOUCH_END, function () {
            btn.setScale(1, 1, 1);
            _this20.toggleSound();
          });
        };
        _proto.onReset = function onReset() {
          this.app.wallet.reset();
          this.profile.reset();
          this.signinBase = 0;
          if (this.profile.themeActive !== COLORS.id) {
            applyTheme(this.profile.themeActive);
            this.rebuildPanels();
          }
          this.toast('本地数据已重置');
          this.show('settings');
        }

        // ─── Toast ────────────────────────────────────
        ;

        _proto.buildToast = function buildToast() {
          var n = uiNode('toast', this.node);
          n.getComponent(UITransform).setContentSize(560, 100);
          var g = n.addComponent(Graphics);
          g.fillColor = new Color(0, 0, 0, 215);
          g.roundRect(-280, -50, 560, 100, 50);
          g.fill();
          g.lineWidth = 2;
          g.strokeColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 180);
          g.roundRect(-280, -50, 560, 100, 50);
          g.stroke();
          this.toastLabel = makeLabel('', 28, COLORS.white, n);
          this.toastLabel.node.setPosition(0, 0);
          n.setPosition(0, -80);
          n.active = false;
        };
        _proto.toast = function toast(text) {
          if (!this.toastLabel) return;
          this.toastLabel.string = text;
          this.toastLabel.node.parent.active = true;
          this.unschedule(this.hideToast);
          this.scheduleOnce(this.hideToast, 2);
        };
        _createClass(GameRoot, [{
          key: "machine",
          get: function get() {
            return this.app.game.current;
          }
        }]);
        return GameRoot;
      }(Component)) || _class));
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/gameStore.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './eventBus.ts', './gameMachine.ts', './boxSet.ts', './rng.ts'], function (exports) {
  var _createClass, cclegacy, EventBus, GameMachine, createBoxSet, systemRng;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      EventBus = module.EventBus;
    }, function (module) {
      GameMachine = module.GameMachine;
    }, function (module) {
      createBoxSet = module.createBoxSet;
    }, function (module) {
      systemRng = module.systemRng;
    }],
    execute: function () {
      cclegacy._RF.push({}, "d943dRSFZdKVK1GAL5D7UBc", "gameStore", undefined);
      var GameStore = exports('GameStore', /*#__PURE__*/function () {
        function GameStore() {
          this.events = new EventBus();
          this.machine = null;
        }
        var _proto = GameStore.prototype;
        /** 开始新一局，返回新状态机实例 */
        _proto.startNewGame = function startNewGame() {
          var _this = this;
          this.machine = new GameMachine(createBoxSet(systemRng), systemRng);
          this.machine.on(function (e) {
            return _this.events.emit(e);
          });
          return this.machine;
        };
        _createClass(GameStore, [{
          key: "current",
          get: function get() {
            return this.machine;
          }
        }]);
        return GameStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/h5.ts", ['cc', './sfx.ts'], function (exports) {
  var cclegacy, createProgrammaticAudio;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      createProgrammaticAudio = module.createProgrammaticAudio;
    }],
    execute: function () {
      exports('createH5Platform', createH5Platform);
      cclegacy._RF.push({}, "8ede7v54cNPPLwY3+/sMwlK", "h5", undefined);
      var PREFIX = 'goldenbox.';
      function createH5Platform() {
        return {
          env: 'h5',
          storage: {
            get: function get(key) {
              return localStorage.getItem(PREFIX + key);
            },
            set: function set(key, value) {
              return localStorage.setItem(PREFIX + key, value);
            },
            remove: function remove(key) {
              return localStorage.removeItem(PREFIX + key);
            }
          },
          ads: {
            showRewarded: function showRewarded(_slot, cb) {
              // H5 使用 Mock 弹层（由 UI 层展示 30 秒倒计时）。
              // 弹层接入前，按“已看完”直接发放奖励，保证流程可继续。
              // TODO: 接入 Mock 广告弹层后，由弹层决定回调时机。
              cb.onReward();
              cb.onClose(false);
              return true;
            },
            showInterstitial: function showInterstitial() {
              // Mock 插屏：暂不弹，仅返回 false 由策略层频控即可。
              return false;
            }
          },
          audio: createProgrammaticAudio(),
          share: {
            share: function share(payload) {
              var text = "" + payload.title + (payload.text ? ' ' + payload.text : '');
              if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
                navigator.share({
                  title: payload.title,
                  text: text,
                  url: payload.url
                })["catch"](function () {});
              } else if (typeof navigator !== 'undefined' && typeof navigator.clipboard !== 'undefined') {
                navigator.clipboard.writeText(text)["catch"](function () {});
              }
            }
          },
          system: {
            getScreenSize: function getScreenSize() {
              return {
                width: window.innerWidth,
                height: window.innerHeight
              };
            },
            getDpr: function getDpr() {
              return window.devicePixelRatio || 1;
            },
            getSafeArea: function getSafeArea() {
              return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              };
            }
          }
        };
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/index.ts", ['cc', './h5.ts', './wxgame.ts'], function (exports) {
  var cclegacy, createH5Platform, createWxGamePlatform;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      createH5Platform = module.createH5Platform;
    }, function (module) {
      createWxGamePlatform = module.createWxGamePlatform;
    }],
    execute: function () {
      exports('createPlatform', createPlatform);
      cclegacy._RF.push({}, "d5f2bqkakVB+KvKzK/cBmD5", "index", undefined);

      // 微信小游戏全局对象（构建环境提供）

      function createPlatform() {
        if (typeof wx !== 'undefined') {
          return createWxGamePlatform();
        }
        return createH5Platform();
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/main", ['./ads.config.ts', './app.ts', './sfx.ts', './adPolicy.ts', './banker.ts', './boxSet.ts', './economy.ts', './gameMachine.ts', './rng.ts', './types2.ts', './GameRoot.ts', './bootstrap.ts', './errorHook.ts', './widgets.ts', './h5.ts', './index.ts', './types.ts', './wxgame.ts', './eventBus.ts', './gameStore.ts', './profileStore.ts', './uiStore.ts', './walletStore.ts', './format.ts'], function () {
  return {
    setters: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
    execute: function () {}
  };
});

System.register("chunks:///_virtual/profileStore.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './adPolicy.ts'], function (exports) {
  var _createClass, cclegacy, startNewGame, endGame, markRewardedShown, createAdPolicyState;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      startNewGame = module.startNewGame;
      endGame = module.endGame;
      markRewardedShown = module.markRewardedShown;
      createAdPolicyState = module.createAdPolicyState;
    }],
    execute: function () {
      cclegacy._RF.push({}, "c7e6dUmZ+VLU5w+vUudheoF", "profileStore", undefined);
      var KEY = 'goldenbox.profile';
      var THEME_PRICE = exports('THEME_PRICE', 800);
      var SHIELD_PRICE = exports('SHIELD_PRICE', 1500);
      var ENERGY_POTION_PRICE = exports('ENERGY_POTION_PRICE', 800);
      var ITEM_REMOVE_LOW_PRICE = exports('ITEM_REMOVE_LOW_PRICE', 2500);
      var ITEM_PROTECT_HIGH_PRICE = exports('ITEM_PROTECT_HIGH_PRICE', 4000);
      var ProfileStore = exports('ProfileStore', /*#__PURE__*/function () {
        function ProfileStore(storage) {
          this.data = void 0;
          this.storage = storage;
          this.data = this.load();
        }
        var _proto = ProfileStore.prototype;
        _proto.setAdsEnabled = function setAdsEnabled(v) {
          this.data.adsEnabled = v;
          this.save();
        };
        _proto.addItem = function addItem(id, n) {
          if (n === void 0) {
            n = 1;
          }
          this.data.items[id] += n;
          this.save();
        }

        /** 消耗一张道具券；库存不足返回 false */;
        _proto.consumeItem = function consumeItem(id) {
          if (this.data.items[id] <= 0) return false;
          this.data.items[id]--;
          this.save();
          return true;
        };
        _proto.setMuted = function setMuted(muted) {
          this.data.muted = muted;
          this.save();
        };
        _proto.startNewGame = function startNewGame$1() {
          startNewGame(this.data.ads);
          this.save();
        };
        _proto.endGame = function endGame$1() {
          endGame(this.data.ads);
          this.save();
        };
        _proto.markRewarded = function markRewarded(slot) {
          markRewardedShown(this.data.ads, slot);
          this.save();
        }

        // ─── 连胜护盾 ───────────────────────────────

        /** 激活护盾（金币由钱包层扣除） */;
        _proto.activateShield = function activateShield() {
          this.data.shieldActive = true;
          this.save();
        }

        /** 结算时消耗护盾 */;
        _proto.consumeShield = function consumeShield() {
          this.data.shieldActive = false;
          this.save();
        }

        // ─── 主题 ───────────────────────────────────
        ;

        _proto.ownsTheme = function ownsTheme(id) {
          return this.data.themesOwned.includes(id);
        }

        /** 购买主题（金币由钱包层扣除） */;
        _proto.buyTheme = function buyTheme(id) {
          if (!this.ownsTheme(id)) this.data.themesOwned.push(id);
          this.save();
        };
        _proto.useTheme = function useTheme(id) {
          if (this.ownsTheme(id)) {
            this.data.themeActive = id;
            this.save();
          }
        };
        _proto.addRank = function addRank(rec) {
          this.data.ranks.unshift(rec);
          if (this.data.ranks.length > 50) this.data.ranks.length = 50;
          this.save();
        }

        /** 本地 TOP10：按最高单局所得排序 */;
        _proto.top10 = function top10() {
          return [].concat(this.data.ranks).sort(function (a, b) {
            return b.finalAmount - a.finalAmount;
          }).slice(0, 10);
        };
        _proto.reset = function reset() {
          this.data = {
            ads: createAdPolicyState(),
            adsEnabled: this.data.adsEnabled,
            items: {
              removeLow: 1,
              protectHigh: 1
            },
            ranks: [],
            muted: this.data.muted,
            shieldActive: false,
            themesOwned: ['royal'],
            themeActive: 'royal'
          };
          this.save();
        };
        _proto.save = function save() {
          this.storage.set(KEY, JSON.stringify(this.data));
        };
        _proto.load = function load() {
          var fallback = {
            ads: createAdPolicyState(),
            adsEnabled: false,
            items: {
              removeLow: 1,
              protectHigh: 1
            },
            ranks: [],
            muted: false,
            shieldActive: false,
            themesOwned: ['royal'],
            themeActive: 'royal'
          };
          var raw = this.storage.get(KEY);
          if (raw === null) return fallback;
          try {
            var _parsed$ads, _parsed$items$removeL, _parsed$items, _parsed$items$protect, _parsed$items2, _parsed$themeActive;
            var parsed = JSON.parse(raw);
            return {
              ads: (_parsed$ads = parsed.ads) != null ? _parsed$ads : fallback.ads,
              adsEnabled: parsed.adsEnabled === true,
              items: {
                removeLow: Math.max(0, Math.floor((_parsed$items$removeL = (_parsed$items = parsed.items) == null ? void 0 : _parsed$items.removeLow) != null ? _parsed$items$removeL : 1)),
                protectHigh: Math.max(0, Math.floor((_parsed$items$protect = (_parsed$items2 = parsed.items) == null ? void 0 : _parsed$items2.protectHigh) != null ? _parsed$items$protect : 1))
              },
              ranks: Array.isArray(parsed.ranks) ? parsed.ranks : [],
              muted: !!parsed.muted,
              shieldActive: !!parsed.shieldActive,
              themesOwned: Array.isArray(parsed.themesOwned) && parsed.themesOwned.length > 0 ? parsed.themesOwned : ['royal'],
              themeActive: (_parsed$themeActive = parsed.themeActive) != null ? _parsed$themeActive : 'royal'
            };
          } catch (_unused) {
            return fallback;
          }
        };
        _createClass(ProfileStore, [{
          key: "ads",
          get: function get() {
            return this.data.ads;
          }
        }, {
          key: "muted",
          get: function get() {
            return this.data.muted;
          }
        }, {
          key: "adsEnabled",
          get: function get() {
            return this.data.adsEnabled;
          }
        }, {
          key: "items",
          get: function get() {
            return this.data.items;
          }
        }, {
          key: "shieldActive",
          get: function get() {
            return this.data.shieldActive;
          }
        }, {
          key: "themesOwned",
          get: function get() {
            return this.data.themesOwned;
          }
        }, {
          key: "themeActive",
          get: function get() {
            return this.data.themeActive;
          }
        }]);
        return ProfileStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/rng.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports({
        chance: chance,
        createSeedRng: createSeedRng,
        pick: pick,
        randomInt: randomInt,
        shuffle: shuffle
      });
      cclegacy._RF.push({}, "8fd6fSCOX9HZaDxuRaJRF3L", "rng", undefined);
      /**
       * 随机数工具。
       * 使用可复现的种子随机源（mulberry32），便于单测与重放。
       */
      /** 返回 [0,1) 的随机数源 */
      /** mulberry32：可复现的种子随机数（测试/重放用） */
      function createSeedRng(seed) {
        var a = seed >>> 0;
        return {
          next: function next() {
            a = a + 0x6d2b79f5 | 0;
            var t = Math.imul(a ^ a >>> 15, 1 | a);
            t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
            return ((t ^ t >>> 14) >>> 0) / 4294967296;
          }
        };
      }

      /** 系统随机源（不可复现，用于真实对局） */
      var systemRng = exports('systemRng', {
        next: function next() {
          return Math.random();
        }
      });

      /** [min, max] 闭区间随机整数 */
      function randomInt(rng, min, max) {
        return Math.floor(rng.next() * (max - min + 1)) + min;
      }

      /** Fisher-Yates 洗牌，返回新数组 */
      function shuffle(rng, arr) {
        var a = arr.slice();
        for (var i = a.length - 1; i > 0; i--) {
          var j = randomInt(rng, 0, i);
          var tmp = a[i];
          a[i] = a[j];
          a[j] = tmp;
        }
        return a;
      }

      /** 从数组中随机取一个 */
      function pick(rng, arr) {
        return arr[randomInt(rng, 0, arr.length - 1)];
      }

      /** 以概率 p 返回 true */
      function chance(rng, p) {
        return rng.next() < p;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/sfx.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc'], function (exports) {
  var _createForOfIteratorHelperLoose, cclegacy;
  return {
    setters: [function (module) {
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      exports('createProgrammaticAudio', createProgrammaticAudio);
      cclegacy._RF.push({}, "e5368YGeiVLer6vBVFr1JzO", "sfx", undefined);
      /**
       * 程序化音频引擎：WebAudio 合成背景音乐与全部音效，无需音频文件。
       * - 单例 AudioContext 懒创建（兼容浏览器自动播放策略：首次用户交互后才真正出声）
       * - 微信小游戏优先 wx.createWebAudioContext，不可用时静默降级不阻塞游戏
       * - setMuted 同时抑制音效并暂停/恢复背景音乐
       */
      /** UI 层点击音总线（widgets 经此触发点击音，避免反向依赖平台层） */
      var uiSfx = exports('uiSfx', {
        play: function play() {}
      });
      function createCtx() {
        var g = globalThis;
        try {
          if (typeof g.AudioContext !== 'undefined') return new g.AudioContext();
          if (typeof g.webkitAudioContext !== 'undefined') return new g.webkitAudioContext();
          if (g.wx && typeof g.wx.createWebAudioContext === 'function') return g.wx.createWebAudioContext();
        } catch (_unused) {
          // 初始化失败静默降级
        }
        return null;
      }

      /** 背景音乐 patterns：每 4 小节循环（低音根音 / 和弦垫 / 五声琶音） */
      var PATTERNS = {
        home: {
          bpm: 92,
          bass: [110, 110, 87.31, 98],
          chords: [[220, 261.63, 329.63], [220, 261.63, 329.63], [174.61, 220, 261.63], [196, 246.94, 293.66]],
          arp: [440, 523.25, 659.25, 523.25, 440, 659.25, 783.99, 659.25],
          arpGain: 0.028
        },
        game: {
          bpm: 112,
          bass: [82.41, 82.41, 98, 87.31],
          chords: [[164.81, 196, 246.94], [164.81, 196, 246.94], [196, 246.94, 293.66], [174.61, 220, 261.63]],
          arp: [329.63, 392, 493.88, 392, 329.63, 493.88, 587.33, 493.88],
          arpGain: 0.024
        },
        "final": {
          // 终局变奏：更快、更低、小二度张力
          bpm: 128,
          bass: [73.42, 73.42, 82.41, 77.78],
          chords: [[164.81, 196, 233.08], [164.81, 196, 233.08], [185, 220, 277.18], [174.61, 220, 233.08]],
          arp: [659.25, 659.25, 783.99, 659.25, 739.99, 659.25, 830.61, 783.99],
          arpGain: 0.03
        }
      };
      function createProgrammaticAudio() {
        var muted = false;
        var ctx = null;
        var bgmWanted = '';
        var bgmPlaying = '';
        var timer = null;
        var step = 0;
        var nextTime = 0;
        var noiseBuf = null;
        var oscCount = 0;
        var lastSfx = '';
        var ensureCtx = function ensureCtx() {
          if (!ctx) ctx = createCtx();
          if (ctx && ctx.state === 'suspended' && ctx.resume) {
            try {
              var r = ctx.resume();
              var restart = function restart() {
                // 恢复后 currentTime 重新走表，重启 BGM 调度避免时间轴错位
                if (bgmPlaying) startBgmLoop(bgmPlaying);
              };
              if (r && typeof r.then === 'function') r.then(restart)["catch"](function () {});else restart();
            } catch (_unused2) {
              // 忽略恢复失败
            }
          }
          return ctx;
        };
        var tone = function tone(freq, dur, opt) {
          var _opt$when, _opt$type, _opt$attack, _opt$gain;
          if (opt === void 0) {
            opt = {};
          }
          if (!ctx) return;
          var t0 = ctx.currentTime + ((_opt$when = opt.when) != null ? _opt$when : 0);
          var osc = ctx.createOscillator();
          var g = ctx.createGain();
          osc.type = (_opt$type = opt.type) != null ? _opt$type : 'sine';
          osc.frequency.setValueAtTime(freq, t0);
          if (opt.slideTo) osc.frequency.exponentialRampToValueAtTime(opt.slideTo, t0 + dur);
          var at = (_opt$attack = opt.attack) != null ? _opt$attack : 0.008;
          g.gain.setValueAtTime(0.0001, t0);
          g.gain.exponentialRampToValueAtTime((_opt$gain = opt.gain) != null ? _opt$gain : 0.06, t0 + at);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          osc.connect(g);
          g.connect(ctx.destination);
          oscCount++;
          osc.start(t0);
          osc.stop(t0 + dur + 0.02);
        };
        var noise = function noise(dur, gain, filterFreq, when) {
          if (when === void 0) {
            when = 0;
          }
          if (!ctx || !ctx.createBufferSource || !ctx.createBiquadFilter) return;
          if (!noiseBuf) {
            noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
            var d = noiseBuf.getChannelData(0);
            for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
          }
          var t0 = ctx.currentTime + when;
          var src = ctx.createBufferSource();
          src.buffer = noiseBuf;
          var f = ctx.createBiquadFilter();
          f.type = 'bandpass';
          f.frequency.value = filterFreq;
          var g = ctx.createGain();
          g.gain.setValueAtTime(gain, t0);
          g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
          src.connect(f);
          f.connect(g);
          g.connect(ctx.destination);
          src.start(t0);
          src.stop(t0 + dur + 0.02);
        };
        var SFX = {
          click: function click() {
            tone(880, 0.05, {
              type: 'triangle',
              gain: 0.035
            });
            tone(1318.51, 0.05, {
              type: 'triangle',
              gain: 0.03,
              when: 0.03
            });
          },
          pick: function pick() {
            tone(659.25, 0.08, {
              type: 'triangle',
              gain: 0.05
            });
            tone(987.77, 0.12, {
              gain: 0.05,
              when: 0.06
            });
          },
          open: function open() {
            noise(0.28, 0.05, 1800);
            tone(300, 0.22, {
              type: 'triangle',
              gain: 0.07,
              slideTo: 150
            });
            tone(90, 0.18, {
              gain: 0.09,
              when: 0.05
            });
          },
          rumble: function rumble() {
            noise(0.4, 0.06, 260);
            tone(75, 0.35, {
              type: 'sawtooth',
              gain: 0.05,
              slideTo: 52
            });
          },
          heartbeat: function heartbeat() {
            for (var i = 0; i < 3; i++) {
              var d = i * 0.5;
              tone(72, 0.1, {
                type: 'square',
                gain: 0.07,
                when: d
              });
              tone(66, 0.12, {
                type: 'square',
                gain: 0.06,
                when: d + 0.16
              });
            }
          },
          reveal: function reveal() {
            tone(880, 0.16, {
              gain: 0.05
            });
            tone(1174.66, 0.24, {
              gain: 0.05,
              when: 0.09
            });
          },
          revealBig: function revealBig() {
            [783.99, 987.77, 1174.66, 1567.98].forEach(function (f, i) {
              return tone(f, 0.22, {
                gain: 0.055,
                when: i * 0.07
              });
            });
            noise(0.5, 0.018, 6000, 0.1);
          },
          banker: function banker() {
            if (!ctx) return;
            // 经典电话铃「铃—铃」：440+480Hz 双音 + 约 20Hz 颤音包络，两声更醒目
            var burst = function burst(when) {
              if (!ctx) return;
              var t0 = ctx.currentTime + when;
              var g = ctx.createGain();
              g.gain.setValueAtTime(0.0001, t0);
              g.gain.setValueAtTime(0.09, t0 + 0.015);
              for (var i = 1; i <= 12; i++) {
                g.gain.setValueAtTime(i % 2 === 1 ? 0.028 : 0.09, t0 + 0.015 + i * 0.042);
              }
              g.gain.setValueAtTime(0.0001, t0 + 0.56);
              for (var _i = 0, _arr = [440, 480]; _i < _arr.length; _i++) {
                var f = _arr[_i];
                var osc = ctx.createOscillator();
                osc.type = 'sine';
                osc.frequency.value = f;
                osc.connect(g);
                g.connect(ctx.destination);
                osc.start(t0);
                osc.stop(t0 + 0.6);
              }
            };
            burst(0);
            burst(0.75);
          },
          deal: function deal() {
            tone(150, 0.2, {
              type: 'square',
              gain: 0.07,
              slideTo: 90
            });
            tone(1244.51, 0.3, {
              gain: 0.05,
              when: 0.12
            });
          },
          noDeal: function noDeal() {
            tone(392, 0.14, {
              type: 'triangle',
              gain: 0.05
            });
            tone(311.13, 0.22, {
              type: 'triangle',
              gain: 0.05,
              when: 0.14
            });
          },
          win: function win() {
            [523.25, 659.25, 783.99, 1046.5].forEach(function (f, i) {
              return tone(f, 0.28, {
                type: 'triangle',
                gain: 0.06,
                when: i * 0.11
              });
            });
            tone(1567.98, 0.5, {
              gain: 0.045,
              when: 0.5
            });
            noise(0.6, 0.016, 7000, 0.45);
          },
          lose: function lose() {
            tone(330, 0.3, {
              type: 'sawtooth',
              gain: 0.04,
              slideTo: 250
            });
            tone(246.94, 0.4, {
              type: 'sawtooth',
              gain: 0.035,
              when: 0.28,
              slideTo: 165
            });
          },
          coin: function coin() {
            tone(1567.98, 0.07, {
              type: 'triangle',
              gain: 0.04
            });
            tone(2093, 0.1, {
              type: 'triangle',
              gain: 0.035,
              when: 0.05
            });
          },
          buy: function buy() {
            tone(1567.98, 0.07, {
              type: 'triangle',
              gain: 0.04
            });
            tone(2093, 0.1, {
              type: 'triangle',
              gain: 0.035,
              when: 0.05
            });
            tone(783.99, 0.14, {
              gain: 0.04,
              when: 0.12
            });
          },
          suspense: function suspense() {
            tone(110, 0.7, {
              type: 'sawtooth',
              gain: 0.04
            });
            tone(220, 0.5, {
              gain: 0.035,
              when: 0.15
            });
            tone(261.63, 0.5, {
              gain: 0.035,
              when: 0.55
            });
          }
        };
        var stopBgmLoop = function stopBgmLoop() {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
          bgmPlaying = '';
        };
        var startBgmLoop = function startBgmLoop(name) {
          if (!ctx) return;
          stopBgmLoop();
          var pat = PATTERNS[name];
          if (!pat) return;
          bgmPlaying = name;
          step = 0;
          nextTime = ctx.currentTime + 0.1;
          var stepDur = 30 / pat.bpm; // 8 分音符
          timer = setInterval(function () {
            if (!ctx) return;
            while (nextTime < ctx.currentTime + 0.3) {
              var bar = Math.floor(step / 8) % 4;
              var s = step % 8;
              var when = Math.max(0, nextTime - ctx.currentTime);
              if (s === 0) {
                tone(pat.bass[bar], stepDur * 7.5, {
                  type: 'sine',
                  gain: 0.045,
                  when: when,
                  attack: 0.05
                });
                for (var _iterator = _createForOfIteratorHelperLoose(pat.chords[bar]), _step; !(_step = _iterator()).done;) {
                  var f = _step.value;
                  tone(f, stepDur * 7, {
                    type: 'triangle',
                    gain: 0.013,
                    when: when,
                    attack: 0.4
                  });
                }
              }
              tone(pat.arp[s], stepDur * 0.9, {
                type: 'sine',
                gain: pat.arpGain,
                when: when
              });
              if (s === 4) noise(0.05, 0.01, 8000, when);
              nextTime += stepDur;
              step++;
            }
          }, 120);
        };
        var api = {
          playSfx: function playSfx(name) {
            var _SFX$name;
            if (muted) return;
            if (!ensureCtx()) return;
            if (!bgmPlaying && !timer && bgmWanted) startBgmLoop(bgmWanted);
            lastSfx = name;
            (_SFX$name = SFX[name]) == null || _SFX$name.call(SFX);
          },
          playBgm: function playBgm(name) {
            bgmWanted = name;
            if (muted || !name) return;
            if (!ensureCtx()) return;
            if (bgmPlaying === name && timer) return;
            startBgmLoop(name);
          },
          setMuted: function setMuted(m) {
            muted = m;
            if (m) {
              stopBgmLoop();
            } else if (bgmWanted) {
              if (!ensureCtx()) return;
              startBgmLoop(bgmWanted);
            }
          }
        };
        uiSfx.play = function (n) {
          return api.playSfx(n);
        };

        // 端到端测试探针
        globalThis.__gbAudio = {
          get state() {
            var _ctx$state;
            return {
              muted: muted,
              bgm: bgmPlaying,
              ctx: ctx ? (_ctx$state = ctx.state) != null ? _ctx$state : 'running' : 'none',
              oscCount: oscCount,
              lastSfx: lastSfx
            };
          }
        };
        return api;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/types.ts", ['cc'], function () {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "57892YQ3z5PcZr0eCrcxxDz", "types", undefined);
      /**
       * 平台适配接口。
       * 核心逻辑禁止直接依赖 window / wx / DOM / Cocos，统一通过本层访问平台能力。
       */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/types2.ts", ['cc'], function (exports) {
  var cclegacy;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }],
    execute: function () {
      cclegacy._RF.push({}, "f5ec5t0/p5NBaSHj0MBkW41", "types", undefined);
      /**
       * 《千金一箱》核心类型定义。
       * 本文件只包含纯类型与常量，禁止依赖 window / wx / DOM / Cocos。
       */

      /** 16 个固定金额档位（每局各出现一次，不设计抽奖） */
      var BOX_AMOUNTS = exports('BOX_AMOUNTS', [1, 10, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000, 1000000]);

      /** 宝箱编号 0..15 */

      var TOTAL_BOXES = exports('TOTAL_BOXES', 16);
      var TOTAL_ROUNDS = exports('TOTAL_ROUNDS', 6);
      /** 头奖金额 */
      var JACKPOT_AMOUNT = exports('JACKPOT_AMOUNT', 1000000);

      /**
       * 每轮打开数量（R1..R6）。
       * 合计 14 箱 + 玩家自选 1 箱 = 15 箱，终局保留 2 个未开宝箱（自己的 + 1 个其他）用于换箱抉择。
       * 已与需求方确认：由计划中的 4,3,3,2,2,1 调整为 4,3,3,2,1,1（第 5 轮改为开 1 箱）。
       */
      var ROUND_OPEN_COUNTS = exports('ROUND_OPEN_COUNTS', [4, 3, 3, 2, 1, 1]);

      /** 状态机状态 */

      // 结算
      /** 单轮中已打开的宝箱 */
      /** 每轮信息 */
      /** 单局记录 */
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/uiStore.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './eventBus.ts'], function (exports) {
  var _createClass, cclegacy, EventBus;
  return {
    setters: [function (module) {
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      EventBus = module.EventBus;
    }],
    execute: function () {
      cclegacy._RF.push({}, "9036dGXEOBF7rvVP5mu5Xt+", "uiStore", undefined);
      var UiStore = exports('UiStore', /*#__PURE__*/function () {
        function UiStore() {
          this.events = new EventBus();
          this._screen = 'boot';
        }
        var _proto = UiStore.prototype;
        _proto.navigate = function navigate(screen) {
          this._screen = screen;
          this.events.emit(screen);
        };
        _createClass(UiStore, [{
          key: "current",
          get: function get() {
            return this._screen;
          }
        }]);
        return UiStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/walletStore.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './eventBus.ts', './economy.ts'], function (exports) {
  var _extends, _createClass, cclegacy, EventBus, MAX_ENERGY, restoreEnergy, tryConsumeEnergy, settleGame, claimSignin;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createClass = module.createClass;
    }, function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      EventBus = module.EventBus;
    }, function (module) {
      MAX_ENERGY = module.MAX_ENERGY;
      restoreEnergy = module.restoreEnergy;
      tryConsumeEnergy = module.tryConsumeEnergy;
      settleGame = module.settleGame;
      claimSignin = module.claimSignin;
      exports('SIGNIN_REWARDS', module.SIGNIN_REWARDS);
    }],
    execute: function () {
      exports('createInitialWallet', createInitialWallet);
      cclegacy._RF.push({}, "4724ap5lKJMA4CIQQMpKinM", "walletStore", undefined);
      var WALLET_KEY = 'goldenbox.wallet';
      var SIGNIN_KEY = 'goldenbox.signin';
      function createInitialWallet(now) {
        return {
          coins: 0,
          energy: MAX_ENERGY,
          lastEnergyAt: now,
          winStreak: 0,
          loseStreak: 0,
          totalGames: 0,
          totalWins: 0,
          highestSingle: 0
        };
      }
      var createInitialSignin = exports('createInitialSignin', function createInitialSignin() {
        return {
          lastSigninDate: '',
          streakDays: 0
        };
      });
      var WalletStore = exports('WalletStore', /*#__PURE__*/function () {
        function WalletStore(storage, now) {
          if (now === void 0) {
            now = Date.now();
          }
          this.events = new EventBus();
          this.storage = void 0;
          this.wallet = void 0;
          this.signinData = void 0;
          this.storage = storage;
          this.wallet = this.load(WALLET_KEY, createInitialWallet(now));
          this.signinData = this.load(SIGNIN_KEY, createInitialSignin());
        }
        var _proto = WalletStore.prototype;
        /** 进入应用时恢复体力并持久化 */
        _proto.tick = function tick(now) {
          if (now === void 0) {
            now = Date.now();
          }
          var restored = restoreEnergy(this.wallet, now);
          if (restored !== this.wallet) {
            this.wallet = restored;
            this.save();
            this.events.emit({
              type: 'energyChanged',
              energy: this.wallet.energy
            });
          }
          return this.wallet;
        }

        /** 开始一局前消耗体力；不足返回 null */;
        _proto.consumeEnergy = function consumeEnergy(now) {
          if (now === void 0) {
            now = Date.now();
          }
          var fresh = this.tick(now);
          var next = tryConsumeEnergy(fresh);
          if (!next) return null;
          this.wallet = next;
          this.save();
          this.events.emit({
            type: 'energyChanged',
            energy: this.wallet.energy
          });
          return this.wallet;
        }

        /** 结算一局（shieldUsed：连胜护盾生效，失败不清空连胜） */;
        _proto.applySettlement = function applySettlement(record, opts) {
          if (opts === void 0) {
            opts = {};
          }
          var _settleGame = settleGame(this.wallet, record, opts),
            state = _settleGame.state,
            result = _settleGame.result;
          this.wallet = state;
          this.save();
          this.events.emit({
            type: 'wallet',
            wallet: this.wallet
          });
          return {
            state: state,
            result: result
          };
        }

        /** 直接发放金币（广告奖励等） */;
        _proto.grantCoins = function grantCoins(amount) {
          this.wallet = _extends({}, this.wallet, {
            coins: this.wallet.coins + amount
          });
          this.save();
          this.events.emit({
            type: 'wallet',
            wallet: this.wallet
          });
          return this.wallet;
        }

        /** 尝试消费金币；不足返回 false */;
        _proto.spendCoins = function spendCoins(amount) {
          if (this.wallet.coins < amount) return false;
          this.wallet = _extends({}, this.wallet, {
            coins: this.wallet.coins - amount
          });
          this.save();
          this.events.emit({
            type: 'wallet',
            wallet: this.wallet
          });
          return true;
        }

        /** 金币补满体力；体力已满或金币不足返回 false */;
        _proto.buyFullEnergy = function buyFullEnergy(cost) {
          if (this.wallet.energy >= MAX_ENERGY) return false;
          if (this.wallet.coins < cost) return false;
          this.wallet = _extends({}, this.wallet, {
            coins: this.wallet.coins - cost,
            energy: MAX_ENERGY
          });
          this.save();
          this.events.emit({
            type: 'wallet',
            wallet: this.wallet
          });
          return true;
        }

        /** 签到；当天已签到时返回 null */;
        _proto.signin = function signin(now, opts) {
          if (now === void 0) {
            now = Date.now();
          }
          if (opts === void 0) {
            opts = {};
          }
          var claimed = claimSignin(this.signinData, now, opts);
          if (!claimed) return null;
          this.signinData = claimed.state;
          this.wallet = _extends({}, this.wallet, {
            coins: this.wallet.coins + claimed.reward
          });
          this.save();
          this.events.emit({
            type: 'signin',
            signin: {
              reward: claimed.reward,
              streakDays: claimed.state.streakDays
            }
          });
          return {
            reward: claimed.reward,
            streakDays: claimed.state.streakDays
          };
        }

        /** 重置本地数据（设置页） */;
        _proto.reset = function reset(now) {
          if (now === void 0) {
            now = Date.now();
          }
          this.wallet = createInitialWallet(now);
          this.signinData = createInitialSignin();
          this.save();
          this.events.emit({
            type: 'wallet',
            wallet: this.wallet
          });
        };
        _proto.load = function load(key, fallback) {
          var raw = this.storage.get(key);
          if (raw === null) return fallback;
          try {
            return _extends({}, fallback, JSON.parse(raw));
          } catch (_unused) {
            return fallback;
          }
        };
        _proto.save = function save() {
          this.storage.set(WALLET_KEY, JSON.stringify(this.wallet));
          this.storage.set(SIGNIN_KEY, JSON.stringify(this.signinData));
        };
        _createClass(WalletStore, [{
          key: "state",
          get: function get() {
            return this.wallet;
          }
        }, {
          key: "signinState",
          get: function get() {
            return this.signinData;
          }
        }]);
        return WalletStore;
      }());
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/widgets.ts", ['./rollupPluginModLoBabelHelpers.js', 'cc', './sfx.ts'], function (exports) {
  var _extends, _createForOfIteratorHelperLoose, cclegacy, Color, Node, UITransform, Layers, Label, HorizontalTextAlignment, VerticalTextAlignment, Overflow, Graphics, assetManager, Texture2D, SpriteFrame, Rect, Sprite, Widget, view, uiSfx;
  return {
    setters: [function (module) {
      _extends = module.extends;
      _createForOfIteratorHelperLoose = module.createForOfIteratorHelperLoose;
    }, function (module) {
      cclegacy = module.cclegacy;
      Color = module.Color;
      Node = module.Node;
      UITransform = module.UITransform;
      Layers = module.Layers;
      Label = module.Label;
      HorizontalTextAlignment = module.HorizontalTextAlignment;
      VerticalTextAlignment = module.VerticalTextAlignment;
      Overflow = module.Overflow;
      Graphics = module.Graphics;
      assetManager = module.assetManager;
      Texture2D = module.Texture2D;
      SpriteFrame = module.SpriteFrame;
      Rect = module.Rect;
      Sprite = module.Sprite;
      Widget = module.Widget;
      view = module.view;
    }, function (module) {
      uiSfx = module.uiSfx;
    }],
    execute: function () {
      exports({
        activeThemeId: activeThemeId,
        amountColor: amountColor,
        applyTheme: applyTheme,
        drawChest: drawChest,
        drawCoin: drawCoin,
        drawIcon: drawIcon,
        drawRect: drawRect,
        drawRule: drawRule,
        loadSpriteFrame: loadSpriteFrame,
        makeButton: makeButton,
        makeIconButton: makeIconButton,
        makeLabel: makeLabel,
        makePanel: makePanel,
        makeRect: makeRect,
        makeSprite: makeSprite,
        makeSpriteButton: makeSpriteButton,
        makeTitle: makeTitle,
        preloadSprites: preloadSprites,
        repaintRect: repaintRect,
        themeIds: themeIds,
        uiNode: uiNode
      });
      cclegacy._RF.push({}, "bdbe7WfDBhO85hX4cBwwpAE", "widgets", undefined);
      var DESIGN_W = exports('DESIGN_W', 720);
      var DESIGN_H = exports('DESIGN_H', 1280);

      // ─── 主题 ───────────────────────────────────────

      var THEMES = exports('THEMES', {
        royal: {
          id: 'royal',
          label: '经典金紫',
          bg: new Color(28, 14, 48, 255),
          stage: new Color(16, 8, 30, 255),
          box: new Color(66, 38, 112, 255),
          boxOwn: new Color(255, 201, 60, 255),
          boxOpened: new Color(52, 44, 66, 255),
          gold: new Color(255, 201, 60, 255),
          goldText: new Color(64, 36, 6, 255),
          white: new Color(255, 255, 255, 255),
          sub: new Color(190, 172, 220, 255),
          green: new Color(46, 204, 113, 255),
          red: new Color(235, 87, 87, 255),
          dark: new Color(0, 0, 0, 195),
          nav: new Color(58, 32, 98, 255)
        },
        ocean: {
          id: 'ocean',
          label: '深海之蓝',
          bg: new Color(8, 24, 44, 255),
          stage: new Color(4, 14, 28, 255),
          box: new Color(24, 58, 102, 255),
          boxOwn: new Color(90, 210, 255, 255),
          boxOpened: new Color(40, 52, 70, 255),
          gold: new Color(90, 210, 255, 255),
          goldText: new Color(6, 32, 52, 255),
          white: new Color(255, 255, 255, 255),
          sub: new Color(150, 180, 215, 255),
          green: new Color(46, 204, 113, 255),
          red: new Color(235, 87, 87, 255),
          dark: new Color(0, 0, 0, 195),
          nav: new Color(18, 44, 80, 255)
        },
        crimson: {
          id: 'crimson',
          label: '绯红舞台',
          bg: new Color(56, 17, 46, 255),
          stage: new Color(24, 7, 20, 255),
          box: new Color(96, 26, 40, 255),
          boxOwn: new Color(255, 201, 60, 255),
          boxOpened: new Color(62, 42, 46, 255),
          gold: new Color(255, 201, 60, 255),
          goldText: new Color(64, 36, 6, 255),
          white: new Color(255, 255, 255, 255),
          sub: new Color(216, 176, 210, 255),
          green: new Color(46, 204, 113, 255),
          red: new Color(235, 87, 87, 255),
          dark: new Color(0, 0, 0, 195),
          nav: new Color(86, 24, 56, 255)
        }
      });

      /** 当前配色（可变对象；applyTheme 原地替换字段，配合面板重建生效） */
      var COLORS = exports('COLORS', _extends({}, THEMES.royal));
      function applyTheme(id) {
        var _THEMES$id;
        Object.assign(COLORS, (_THEMES$id = THEMES[id]) != null ? _THEMES$id : THEMES.royal);
      }
      function activeThemeId() {
        return COLORS.id;
      }
      function themeIds() {
        return Object.keys(THEMES);
      }

      /** 金额配色：大金额（≥10,000）金色醒目 / 小金额白色 */
      function amountColor(v) {
        if (v >= 5000) return COLORS.gold;
        return COLORS.white;
      }

      // ─── 节点与文本 ─────────────────────────────────

      /** 创建带 UITransform 且位于 UI_2D 层的节点（2D 相机只渲染该层） */
      function uiNode(name, parent) {
        var n = new Node(name);
        n.addComponent(UITransform);
        n.layer = Layers.Enum.UI_2D;
        if (parent) parent.addChild(n);
        return n;
      }
      function makeLabel(text, fontSize, color, parent) {
        if (color === void 0) {
          color = COLORS.white;
        }
        var n = uiNode('label', parent);
        var lb = n.addComponent(Label);
        lb.string = text;
        lb.fontSize = fontSize;
        lb.lineHeight = Math.round(fontSize * 1.35);
        lb.color = color;
        lb.horizontalAlign = HorizontalTextAlignment.CENTER;
        lb.verticalAlign = VerticalTextAlignment.CENTER;
        lb.overflow = Overflow.NONE;
        return lb;
      }

      /** 圆角矩形底板（Graphics 绘制，无需图片资源） */
      function makeRect(name, parent, w, h, color, radius) {
        if (radius === void 0) {
          radius = 12;
        }
        var n = uiNode(name, parent);
        n.getComponent(UITransform).setContentSize(w, h);
        drawRect(n, color, w, h, radius);
        return n;
      }
      function drawRect(n, color, w, h, radius) {
        var _n$getComponent;
        if (radius === void 0) {
          radius = 12;
        }
        var g = (_n$getComponent = n.getComponent(Graphics)) != null ? _n$getComponent : n.addComponent(Graphics);
        g.clear();
        g.fillColor = color;
        g.roundRect(-w / 2, -h / 2, w, h, radius);
        g.fill();
      }
      function repaintRect(n, color, radius) {
        if (radius === void 0) {
          radius = 12;
        }
        var ut = n.getComponent(UITransform);
        drawRect(n, color, ut.width, ut.height, radius);
      }

      /** 金色装饰分隔线 */
      function drawRule(parent, y, w) {
        if (w === void 0) {
          w = 320;
        }
        var n = uiNode('rule', parent);
        n.getComponent(UITransform).setContentSize(w, 4);
        var g = n.addComponent(Graphics);
        g.fillColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 150);
        g.roundRect(-w / 2, -2, w, 4, 2);
        g.fill();
        n.setPosition(0, y);
      }

      // ─── 按钮（立体：阴影 + 主体 + 高光 + 描边） ────

      function paintButton(n, bg, radius, border) {
        var _n$getComponent2;
        var ut = n.getComponent(UITransform);
        var g = (_n$getComponent2 = n.getComponent(Graphics)) != null ? _n$getComponent2 : n.addComponent(Graphics);
        var w = ut.width;
        var h = ut.height;
        g.clear();
        // 底部阴影
        g.fillColor = new Color(0, 0, 0, 120);
        g.roundRect(-w / 2, -h / 2 - 6, w, h, radius);
        g.fill();
        // 主体
        g.fillColor = bg;
        g.roundRect(-w / 2, -h / 2, w, h, radius);
        g.fill();
        // 顶部高光
        g.fillColor = new Color(255, 255, 255, 45);
        g.roundRect(-w / 2 + 6, h / 2 - h * 0.4, w - 12, h * 0.28, radius / 2);
        g.fill();
        // 描边
        g.lineWidth = 3;
        g.strokeColor = border != null ? border : new Color(255, 255, 255, 85);
        g.roundRect(-w / 2, -h / 2, w, h, radius);
        g.stroke();
      }

      /** 文本按钮：触摸缩放反馈，TOUCH_END 触发回调 */
      function makeButton(text, onClick, parent, spec) {
        var _spec$w, _spec$h, _spec$bg, _spec$fontSize, _spec$fg;
        if (spec === void 0) {
          spec = {};
        }
        var w = (_spec$w = spec.w) != null ? _spec$w : 300;
        var h = (_spec$h = spec.h) != null ? _spec$h : 88;
        var n = uiNode("btn_" + text, parent);
        n.getComponent(UITransform).setContentSize(w, h);
        paintButton(n, (_spec$bg = spec.bg) != null ? _spec$bg : COLORS.gold, h / 2, spec.border);
        var lb = makeLabel(text, (_spec$fontSize = spec.fontSize) != null ? _spec$fontSize : 32, (_spec$fg = spec.fg) != null ? _spec$fg : COLORS.goldText, n);
        lb.node.setPosition(0, 2);
        n.on(Node.EventType.TOUCH_START, function () {
          return n.setScale(0.94, 0.94, 1);
        });
        n.on(Node.EventType.TOUCH_CANCEL, function () {
          return n.setScale(1, 1, 1);
        });
        n.on(Node.EventType.TOUCH_END, function () {
          n.setScale(1, 1, 1);
          uiSfx.play('click');
          onClick();
        });
        return n;
      }

      // ─── 首页装饰素材：金币 / 图标 / 图标按钮 ───────

      /** 金币（金色圆 + 内环 + 高光），可用于散落装饰 */
      function drawCoin(g, x, y, r) {
        g.fillColor = COLORS.gold;
        g.circle(x, y, r);
        g.fill();
        g.fillColor = new Color(206, 148, 14, 255);
        g.circle(x, y, r * 0.64);
        g.fill();
        g.fillColor = new Color(255, 232, 155, 255);
        g.circle(x - r * 0.28, y + r * 0.28, r * 0.2);
        g.fill();
      }

      /** 线性金图标绘制（签到日历 / 奖杯 / 购物车 / 设置滑条） */
      function drawIcon(g, type, size) {
        if (size === void 0) {
          size = 44;
        }
        var s = size / 100;
        g.lineWidth = 7 * s;
        g.strokeColor = COLORS.gold;
        g.fillColor = COLORS.gold;
        if (type === 'calendar') {
          g.roundRect(-30 * s, -30 * s, 60 * s, 46 * s, 9 * s);
          g.stroke();
          g.moveTo(-30 * s, -14 * s);
          g.lineTo(30 * s, -14 * s);
          g.stroke();
          g.moveTo(-14 * s, -38 * s);
          g.lineTo(-14 * s, -26 * s);
          g.stroke();
          g.moveTo(14 * s, -38 * s);
          g.lineTo(14 * s, -26 * s);
          g.stroke();
          g.moveTo(-13 * s, 2 * s);
          g.lineTo(-2 * s, 13 * s);
          g.lineTo(21 * s, -12 * s);
          g.stroke();
        } else if (type === 'trophy') {
          g.roundRect(-25 * s, -26 * s, 50 * s, 34 * s, 10 * s);
          g.stroke();
          g.moveTo(-25 * s, -8 * s);
          g.lineTo(-37 * s, -14 * s);
          g.lineTo(-37 * s, 2 * s);
          g.lineTo(-25 * s, 6 * s);
          g.stroke();
          g.moveTo(25 * s, -8 * s);
          g.lineTo(37 * s, -14 * s);
          g.lineTo(37 * s, 2 * s);
          g.lineTo(25 * s, 6 * s);
          g.stroke();
          g.moveTo(0, 8 * s);
          g.lineTo(0, 22 * s);
          g.stroke();
          g.roundRect(-24 * s, 20 * s, 48 * s, 14 * s, 5 * s);
          g.fill();
        } else if (type === 'cart') {
          g.moveTo(-30 * s, -26 * s);
          g.lineTo(-40 * s, -30 * s);
          g.stroke();
          g.roundRect(-30 * s, -26 * s, 44 * s, 30 * s, 6 * s);
          g.stroke();
          g.moveTo(14 * s, -26 * s);
          g.lineTo(32 * s, -20 * s);
          g.lineTo(24 * s, 12 * s);
          g.lineTo(-30 * s, 12 * s);
          g.stroke();
          g.circle(-14 * s, 30 * s, 9 * s);
          g.stroke();
          g.circle(22 * s, 30 * s, 9 * s);
          g.stroke();
        } else if (type === 'slider') {
          for (var i = 0; i < 3; i++) {
            var y = -24 * s + i * 24 * s;
            g.moveTo(-36 * s, y);
            g.lineTo(36 * s, y);
            g.stroke();
            var knobX = i === 1 ? 14 * s : -8 * s;
            g.circle(knobX, y, 9.5 * s);
            g.fill();
          }
        } else if (type === 'gear') {
          g.lineWidth = 8 * s;
          g.circle(0, 0, 22 * s);
          g.stroke();
          for (var _i = 0; _i < 8; _i++) {
            var a = _i * Math.PI / 4;
            g.circle(Math.cos(a) * 31 * s, Math.sin(a) * 31 * s, 8.5 * s);
            g.fill();
          }
          g.lineWidth = 6 * s;
          g.circle(0, 0, 9 * s);
          g.stroke();
        }
      }

      /** 图标 + 文字按钮（深色底 + 金边，图标居左） */
      function makeIconButton(text, icon, onClick, parent, spec) {
        var _spec$w2, _spec$h2, _spec$bg2, _spec$border, _spec$fontSize2, _spec$fg2;
        if (spec === void 0) {
          spec = {};
        }
        var w = (_spec$w2 = spec.w) != null ? _spec$w2 : 300;
        var h = (_spec$h2 = spec.h) != null ? _spec$h2 : 96;
        var n = uiNode("btn_" + text, parent);
        n.getComponent(UITransform).setContentSize(w, h);
        paintButton(n, (_spec$bg2 = spec.bg) != null ? _spec$bg2 : COLORS.nav, h / 2, (_spec$border = spec.border) != null ? _spec$border : COLORS.gold);
        var ic = uiNode('icon', n);
        ic.addComponent(UITransform).setContentSize(60, 60);
        ic.setPosition(-w / 2 + 64, 0);
        var g = ic.addComponent(Graphics);
        drawIcon(g, icon, 42);
        var lb = makeLabel(text, (_spec$fontSize2 = spec.fontSize) != null ? _spec$fontSize2 : 30, (_spec$fg2 = spec.fg) != null ? _spec$fg2 : COLORS.white, n);
        lb.node.setPosition(14, 0);
        n.on(Node.EventType.TOUCH_START, function () {
          return n.setScale(0.94, 0.94, 1);
        });
        n.on(Node.EventType.TOUCH_CANCEL, function () {
          return n.setScale(1, 1, 1);
        });
        n.on(Node.EventType.TOUCH_END, function () {
          n.setScale(1, 1, 1);
          uiSfx.play('click');
          onClick();
        });
        return n;
      }

      // ─── 精灵图助手（assets/resources/ui 下的 GPT 切图） ──────────

      var spriteCache = new Map();

      /** 加载 resources/ui 下的切图（bundle 懒加载 + 帧缓存）。
       *  说明：CLI 构建不会生成 spriteFrame 子资源，因此加载 texture 子资源后手动构造 SpriteFrame */
      function loadSpriteFrame(name) {
        var hit = spriteCache.get(name);
        if (hit) return Promise.resolve(hit);
        return new Promise(function (resolve, reject) {
          assetManager.loadBundle('resources', function (bundleErr, bundle) {
            if (bundleErr || !bundle) {
              reject(bundleErr != null ? bundleErr : new Error('resources bundle missing'));
              return;
            }
            bundle.load("ui/" + name + "/texture", Texture2D, function (err, tex) {
              if (err || !tex) {
                reject(err != null ? err : new Error("sprite not found: " + name));
                return;
              }
              var frame = new SpriteFrame();
              frame.texture = tex;
              frame.rect = new Rect(0, 0, tex.width, tex.height);
              spriteCache.set(name, frame);
              resolve(frame);
            });
          });
        });
      }

      /** 预加载一批精灵（全部 settle，不因个别失败中断） */
      function preloadSprites(names) {
        return Promise.allSettled(names.map(function (n) {
          return loadSpriteFrame(n);
        })).then(function () {
          return undefined;
        });
      }

      /** 用切图创建 Sprite 节点：传目标宽，高按原图比例自动计算（始终等比） */
      function makeSprite(name, parent, w) {
        var n = uiNode("sp_" + name, parent);
        var sp = n.addComponent(Sprite);
        sp.sizeMode = Sprite.SizeMode.CUSTOM;
        sp.type = Sprite.Type.SIMPLE;
        var apply = function apply(f) {
          sp.spriteFrame = f;
          var rect = f.getRect();
          n.getComponent(UITransform).setContentSize(w, Math.round(rect.height * w / rect.width));
        };
        var hit = spriteCache.get(name);
        if (hit) apply(hit);else loadSpriteFrame(name).then(apply)["catch"](function () {});
        return n;
      }

      /** 切图按钮：按下缩放反馈，点击回调 */
      function makeSpriteButton(name, onClick, parent, w) {
        var n = makeSprite(name, parent, w);
        n.on(Node.EventType.TOUCH_START, function () {
          return n.setScale(0.95, 0.95, 1);
        });
        n.on(Node.EventType.TOUCH_CANCEL, function () {
          return n.setScale(1, 1, 1);
        });
        n.on(Node.EventType.TOUCH_END, function () {
          n.setScale(1, 1, 1);
          uiSfx.play('click');
          onClick();
        });
        return n;
      }

      // ─── 宝箱质感绘制 ───────────────────────────────

      /** 宝箱：阴影 + 箱体 + 盖沿高光 + 中缝 + 金锁扣 + 描边 */
      function drawChest(n, base, trim, opened) {
        var _n$getComponent3;
        var ut = n.getComponent(UITransform);
        var g = (_n$getComponent3 = n.getComponent(Graphics)) != null ? _n$getComponent3 : n.addComponent(Graphics);
        var w = ut.width;
        var h = ut.height;
        g.clear();
        // 投影
        g.fillColor = new Color(0, 0, 0, 100);
        g.roundRect(-w / 2 + 4, -h / 2 - 6, w, h, 16);
        g.fill();
        // 箱体
        g.fillColor = base;
        g.roundRect(-w / 2, -h / 2, w, h, 16);
        g.fill();
        // 盖沿高光
        g.fillColor = new Color(255, 255, 255, opened ? 12 : 30);
        g.roundRect(-w / 2 + 7, h * 0.12, w - 14, h * 0.3, 10);
        g.fill();
        // 中缝
        g.fillColor = new Color(0, 0, 0, opened ? 30 : 70);
        g.rect(-w / 2 + 7, -7, w - 14, 14);
        g.fill();
        // 锁扣（打开后不再绘制，突出金额）
        if (!opened) {
          g.fillColor = trim;
          g.roundRect(-15, -15, 30, 30, 6);
          g.fill();
          g.fillColor = new Color(0, 0, 0, 60);
          g.rect(-4, -15, 8, 14);
          g.fill();
        }
        // 描边
        g.lineWidth = 3;
        g.strokeColor = trim;
        g.roundRect(-w / 2, -h / 2, w, h, 16);
        g.stroke();
      }

      // ─── 舞台化全屏面板 ────────────────────────────

      /** 固定伪随机星点（避免每帧随机） */
      var STARS = function () {
        var arr = [];
        for (var i = 0; i < 22; i++) {
          arr.push({
            x: (i * 137 % 1000 / 1000 - 0.5) * DESIGN_W * 0.92,
            y: DESIGN_H * 0.3 - i * 263 % 1000 / 1000 * DESIGN_H * 0.42,
            r: 1.5 + i % 3
          });
        }
        return arr;
      }();
      function paintStage(n, withFloor) {
        var _n$getComponent4;
        if (withFloor === void 0) {
          withFloor = true;
        }
        var g = (_n$getComponent4 = n.getComponent(Graphics)) != null ? _n$getComponent4 : n.addComponent(Graphics);
        var w = DESIGN_W;
        // FIXED_WIDTH 下高度随屏幕伸缩：舞台按实际可视高度绘制
        var h = Math.max(DESIGN_H, view.getVisibleSize().height);
        g.clear();
        // 主背景（宽屏两侧留边由相机清除色填充，见 GameRoot.applyCameraClear）
        g.fillColor = COLORS.bg;
        g.rect(-w / 2, -h / 2, w, h);
        g.fill();
        // 顶部聚光灯锥（两条低透明度光束）
        g.fillColor = new Color(255, 255, 255, 14);
        g.moveTo(-w * 0.42, h / 2);
        g.lineTo(w * 0.05, -h * 0.16);
        g.lineTo(-w * 0.16, -h * 0.16);
        g.close();
        g.fill();
        g.moveTo(w * 0.42, h / 2);
        g.lineTo(-w * 0.05, -h * 0.16);
        g.lineTo(w * 0.16, -h * 0.16);
        g.close();
        g.fill();
        // 舞台星光（纵向随可视高度展开）
        g.fillColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 70);
        for (var _iterator = _createForOfIteratorHelperLoose(STARS), _step; !(_step = _iterator()).done;) {
          var s = _step.value;
          g.circle(s.x, s.y / DESIGN_H * h, s.r);
          g.fill();
        }
        // 底部舞台地板（首页效果图无地板线，可关闭）
        if (withFloor) {
          g.fillColor = COLORS.stage;
          g.rect(-w / 2, -h / 2, w, 230);
          g.fill();
          g.fillColor = new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 200);
          g.rect(-w / 2, -h / 2 + 228, w, 5);
          g.fill();
        }
      }

      /** 全屏舞台面板：四边对齐 Canvas，默认隐藏 */
      function makePanel(name, parent, withFloor) {
        if (withFloor === void 0) {
          withFloor = true;
        }
        var n = uiNode(name, parent);
        n.getComponent(UITransform).setContentSize(DESIGN_W, DESIGN_H);
        var w = n.addComponent(Widget);
        w.isAlignTop = true;
        w.isAlignBottom = true;
        w.isAlignLeft = true;
        w.isAlignRight = true;
        w.top = 0;
        w.bottom = 0;
        w.left = 0;
        w.right = 0;
        paintStage(n, withFloor);
        n.active = false;
        return n;
      }

      /** 大标题：光晕衬底 + 主体 + 金色分隔线 */
      function makeTitle(text, parent, y, fontSize) {
        if (y === void 0) {
          y = 560;
        }
        if (fontSize === void 0) {
          fontSize = 64;
        }
        var glow = makeLabel(text, Math.round(fontSize * 1.14), new Color(COLORS.gold.r, COLORS.gold.g, COLORS.gold.b, 60), parent);
        glow.node.setPosition(0, y - 3);
        var lb = makeLabel(text, fontSize, COLORS.gold, parent);
        lb.node.setPosition(0, y);
        drawRule(parent, y - fontSize * 0.74, Math.max(280, fontSize * 5.2));
        return lb;
      }
      cclegacy._RF.pop();
    }
  };
});

System.register("chunks:///_virtual/wxgame.ts", ['cc', './ads.config.ts', './sfx.ts'], function (exports) {
  var cclegacy, ADS_CONFIG, createProgrammaticAudio;
  return {
    setters: [function (module) {
      cclegacy = module.cclegacy;
    }, function (module) {
      ADS_CONFIG = module.ADS_CONFIG;
    }, function (module) {
      createProgrammaticAudio = module.createProgrammaticAudio;
    }],
    execute: function () {
      exports('createWxGamePlatform', createWxGamePlatform);
      cclegacy._RF.push({}, "0091ciaEKNEeYtRrek3mGAA", "wxgame", undefined);

      // 微信小游戏全局对象（构建环境提供）

      function createWxGamePlatform() {
        return {
          env: 'wxgame',
          storage: {
            get: function get(key) {
              var v = wx.getStorageSync(key);
              return typeof v === 'string' && v !== '' ? v : null;
            },
            set: function set(key, value) {
              return wx.setStorageSync(key, value);
            },
            remove: function remove(key) {
              return wx.removeStorageSync(key);
            }
          },
          ads: {
            showRewarded: function showRewarded(slot, cb) {
              var adUnitId = ADS_CONFIG.rewarded[slot];
              if (!adUnitId) {
                cb.onError(new Error("empty adUnitId for " + slot));
                return false;
              }
              try {
                var ad = wx.createRewardedVideoAd({
                  adUnitId: adUnitId
                });
                ad.offClose();
                ad.onClose(function (res) {
                  var ended = !!(res && res.isEnded);
                  if (ended) cb.onReward();
                  cb.onClose(!ended);
                });
                ad.offError();
                ad.onError(function (err) {
                  return cb.onError(err);
                });
                ad.show()["catch"](function () {
                  return ad.load().then(function () {
                    return ad.show();
                  })["catch"](function (err) {
                    return cb.onError(err);
                  });
                });
                return true;
              } catch (err) {
                cb.onError(err);
                return false;
              }
            },
            showInterstitial: function showInterstitial() {
              if (!ADS_CONFIG.interstitial) return false;
              try {
                var ad = wx.createInterstitialAd({
                  adUnitId: ADS_CONFIG.interstitial
                });
                ad.show()["catch"](function () {});
                return true;
              } catch (_unused) {
                return false;
              }
            }
          },
          // 程序化音频引擎：优先 wx.createWebAudioContext，低版本基础库静默降级
          audio: createProgrammaticAudio(),
          share: {
            share: function share(payload) {
              if (typeof wx.shareAppMessage === 'function') {
                var _payload$url;
                wx.shareAppMessage({
                  title: payload.title,
                  query: (_payload$url = payload.url) != null ? _payload$url : ''
                });
              }
            }
          },
          system: {
            getScreenSize: function getScreenSize() {
              var _wx$getSystemInfoSync, _info$windowWidth, _info$windowHeight;
              var info = (_wx$getSystemInfoSync = wx.getSystemInfoSync == null ? void 0 : wx.getSystemInfoSync()) != null ? _wx$getSystemInfoSync : {};
              return {
                width: (_info$windowWidth = info.windowWidth) != null ? _info$windowWidth : 375,
                height: (_info$windowHeight = info.windowHeight) != null ? _info$windowHeight : 667
              };
            },
            getDpr: function getDpr() {
              var _wx$getSystemInfoSync2, _wx$getSystemInfoSync3;
              return (_wx$getSystemInfoSync2 = wx.getSystemInfoSync == null || (_wx$getSystemInfoSync3 = wx.getSystemInfoSync()) == null ? void 0 : _wx$getSystemInfoSync3.pixelRatio) != null ? _wx$getSystemInfoSync2 : 1;
            },
            getSafeArea: function getSafeArea() {
              var _wx$getSystemInfoSync4, _info$windowWidth2, _info$windowHeight2;
              var info = (_wx$getSystemInfoSync4 = wx.getSystemInfoSync == null ? void 0 : wx.getSystemInfoSync()) != null ? _wx$getSystemInfoSync4 : {};
              var sa = info.safeArea;
              if (!sa) return {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
              };
              return {
                top: sa.top,
                right: ((_info$windowWidth2 = info.windowWidth) != null ? _info$windowWidth2 : 375) - sa.right,
                bottom: ((_info$windowHeight2 = info.windowHeight) != null ? _info$windowHeight2 : 667) - sa.bottom,
                left: sa.left
              };
            }
          }
        };
      }
      cclegacy._RF.pop();
    }
  };
});

(function(r) {
  r('virtual:///prerequisite-imports/main', 'chunks:///_virtual/main'); 
})(function(mid, cid) {
    System.register(mid, [cid], function (_export, _context) {
    return {
        setters: [function(_m) {
            var _exportObj = {};

            for (var _key in _m) {
              if (_key !== "default" && _key !== "__esModule") _exportObj[_key] = _m[_key];
            }
      
            _export(_exportObj);
        }],
        execute: function () { }
    };
    });
});