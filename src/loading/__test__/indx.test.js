import simulate from 'miniprogram-simulate';
import path from 'path';

describe('loading', () => {
  const loading = simulate.load(path.resolve(__dirname, `../loading`), {
    rootPath: path.resolve(__dirname, `../../../src`),
    less: true,
  });

  describe('props', () => {
    it(`: loading`, async () => {
      const id = simulate.load({
        template: `<t-loading class="base" loading="{{loading}}" delay="{{delay}}"></t-loading>`,
        data: {
          loading: true,
          delay: 0,
        },
        methods: {},
        usingComponents: {
          't-loading': loading,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));

      await simulate.sleep(10);
      comp.setData({ loading: true, delay: 0 });

      await simulate.sleep(10);
      comp.setData({ loading: true, delay: 1 });

      // loading = `false`, 判断 show = false
      await simulate.sleep(10);
      comp.setData({ loading: false });
      expect(comp.data.show).not.toBeTruthy();

      const $loading = comp.querySelector('.base >>> .t-loading');
      expect($loading.dom.getAttribute('style').includes('display:none')).toBeTruthy();
    });

    it(`: theme`, () => {
      const id = simulate.load({
        template: `
        <t-loading class="base" theme="{{theme}}" loading="{{loading}}"></t-loading>
        `,
        data: {
          theme: 'circular',
          loading: true,
        },
        methods: {},
        usingComponents: {
          't-loading': loading,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));

      // 结构检测断言
      // theme = `circular`
      const indicator = comp.querySelector('.base >>> .t-class-indicator ');
      expect(indicator.dom.getAttribute('class').includes('t-loading__spinner--circular')).toBeTruthy();

      // theme = `error`, 判断 t-loading__bar 模块是否按预期不存在
      comp.setData({ theme: 'error' });
      const loadingBar = comp.querySelector('.base >>> .t-loading__bar');
      expect(loadingBar).toBeUndefined();
    });

    it(`: size`, () => {
      const id = simulate.load({
        template: `
        <t-loading class="base" size="{{size}}" loading="{{loading}}"></t-loading>
        `,
        data: {
          size: '44rpx',
          loading: true,
        },
        methods: {},
        usingComponents: {
          't-loading': loading,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));

      // 样式检测断言
      // 判断 indicator size是否按预期为20px
      comp.setData({ size: '20px' });
      const indicator = comp.querySelector('.base >>> .t-class-indicator ');
      expect(window.getComputedStyle(indicator.dom).width).toBe('20px');
    });
  });

  describe('event', () => {
    it(`loading :`, async () => {
      const handleReload = jest.fn();
      const id = simulate.load({
        template: `
        <t-loading
          class="base"
          theme="{{theme}}"
          loading="{{loading}}"
          bind:reload="handleReload"
        ></t-loading>
        `,
        data: {
          theme: 'circular',
          loading: false,
        },
        methods: {
          handleReload,
        },
        usingComponents: {
          't-loading': loading,
        },
      });

      const comp = simulate.render(id);
      comp.attach(document.createElement('parent-wrapper'));

      // theme = 'error', 存在 reload 事件
      comp.setData({ theme: 'error' });
      const $refresh = comp.querySelector('.base >>> .t-loading__refresh-btn');
      $refresh.dispatchEvent('tap');
      await simulate.sleep(10);
      expect(handleReload).toHaveBeenCalledTimes(1);

      comp.detach();
    });
  });
});