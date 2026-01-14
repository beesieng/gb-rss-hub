import type { Namespace } from '@/types';

export const namespace: Namespace = {
    name: 'Archiposition',
    url: 'archiposition.com',
    description: `
::: tip
图片防盗链。
需要将 \`ALLOW_USER_HOTLINK_TEMPLATE\` 环境变量设置为 \`true\` ，然后配置\`image_hotlink_template\` 参数来代理图片。
:::`,
    zh: {
        name: '建筑资讯',
    }
};