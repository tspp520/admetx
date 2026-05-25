export type ModelCard = {
  slug: string; name: string; category: string;
  type: 'classification' | 'regression';
  description: string; status: 'placeholder';
};

export const MODELS: ModelCard[] = [
  { slug: 'bbb', name: '血脑屏障渗透 (BBB)', category: '分布', type: 'classification',
    description: '判断化合物能否穿过血脑屏障', status: 'placeholder' },
  { slug: 'herg', name: 'hERG 心毒性', category: '毒性', type: 'classification',
    description: '预测化合物是否抑制 hERG 钾通道', status: 'placeholder' },
  { slug: 'logp', name: 'LogP (脂水分配)', category: '物化', type: 'regression',
    description: '油水分配系数估算', status: 'placeholder' },
  { slug: 'caco2', name: 'Caco-2 渗透性', category: '吸收', type: 'regression',
    description: '肠道渗透率代理指标', status: 'placeholder' },
  { slug: 'cyp3a4-i', name: 'CYP3A4 抑制', category: '代谢', type: 'classification',
    description: '是否抑制 CYP3A4 代谢酶', status: 'placeholder' },
  { slug: 'ames', name: 'AMES 致突变', category: '毒性', type: 'classification',
    description: '致突变性筛查', status: 'placeholder' },
];
