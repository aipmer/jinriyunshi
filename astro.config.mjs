// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';

const SITE = 'https://example.com';

// https://astro.build/config
export default defineConfig({
  // 原站点 jinriyunshi.info 已下线，域名不再由本项目持有。
  // 此处为占位符：fork 后改成你自己的域名即可，全站 canonical / og:image 都由它派生。
  site: SITE,
  devToolbar: {
    enabled: false,
  },
  integrations: [react(), sitemap({
    serialize(item) {
      if (item.url === SITE + '/') {
        item.changefreq = ChangeFreqEnum.DAILY;
        item.priority = 1.0;
      } else {
        item.changefreq = ChangeFreqEnum.WEEKLY;
        item.priority = 0.7;
      }
      item.lastmod = new Date().toISOString();
      return item;
    }
  })],
  vite: {
    plugins: [tailwindcss()]
  }
});
