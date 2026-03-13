/**
 * Semantic Skill Mapping — Cross-language skill equivalence engine
 *
 * Enables international skill matching across the Be[X] platform.
 * "Softwareentwicklung" (DE) = "Software Development" (EN) = "Développement logiciel" (FR).
 * When two Pioneers have the same skill in different languages, the matching
 * engine recognizes them as equivalent via canonical skill IDs.
 *
 * Data source: CRAFT_SUGGESTIONS from lib/dimensions.ts
 * Used by: matching engine, Compass routing, Pioneer profiles, Anchor path filtering
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Canonical skill definition with multilingual labels and relationship graph */
export interface SkillCanonical {
  /** Unique slug identifier, e.g. 'software-engineering' */
  id: string
  /** Skill domain: tech, business, creative, trades, health, education, nature, service */
  category:
    | 'tech'
    | 'business'
    | 'creative'
    | 'trades'
    | 'health'
    | 'education'
    | 'nature'
    | 'service'
  /** Language code → localized label (en, de, fr, sw minimum) */
  labels: Record<string, string>
  /** Common alternative names in any language (abbreviations, compound words, informal) */
  aliases: string[]
  /** IDs of related/complementary skills */
  related: string[]
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const SKILL_REGISTRY: SkillCanonical[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // Tech
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'software-engineering',
    category: 'tech',
    labels: {
      en: 'Software Engineering',
      de: 'Softwareentwicklung',
      fr: 'Ingénierie logicielle',
      sw: 'Uhandisi wa Programu',
      es: 'Ingeniería de Software',
      pt: 'Engenharia de Software',
      ar: 'هندسة البرمجيات',
      zh: '软件工程',
      hi: 'सॉफ्टवेयर इंजीनियरिंग',
      ja: 'ソフトウェアエンジニアリング',
      ko: '소프트웨어 공학',
      th: 'วิศวกรรมซอฟต์แวร์',
    },
    aliases: [
      'software development',
      'software dev',
      'coding',
      'programming',
      'developer',
      'Softwareentwickler',
      'Programmierer',
      'développement logiciel',
      'programación',
      'desarrollo de software',
    ],
    related: ['frontend-development', 'backend-development', 'mobile-development', 'devops'],
  },
  {
    id: 'data-science',
    category: 'tech',
    labels: {
      en: 'Data Science',
      de: 'Datenwissenschaft',
      fr: 'Science des données',
      sw: 'Sayansi ya Data',
      es: 'Ciencia de Datos',
      pt: 'Ciência de Dados',
      ar: 'علم البيانات',
      zh: '数据科学',
      hi: 'डेटा साइंस',
      ja: 'データサイエンス',
      ko: '데이터 과학',
      th: 'วิทยาศาสตร์ข้อมูล',
    },
    aliases: [
      'data analyst',
      'data analytics',
      'Datenanalyse',
      'big data',
      'analyse de données',
      'análisis de datos',
    ],
    related: ['ai-ml', 'business-analysis', 'research'],
  },
  {
    id: 'ux-design',
    category: 'tech',
    labels: {
      en: 'UX Design',
      de: 'UX-Design',
      fr: 'Design UX',
      sw: 'Muundo wa UX',
      es: 'Diseño UX',
      pt: 'Design UX',
      ar: 'تصميم تجربة المستخدم',
      zh: '用户体验设计',
      hi: 'यूएक्स डिज़ाइन',
      ja: 'UXデザイン',
      ko: 'UX 디자인',
      th: 'ออกแบบ UX',
    },
    aliases: [
      'UX',
      'UI',
      'UI/UX',
      'UX/UI',
      'user experience',
      'user interface design',
      'UI design',
      'Benutzererfahrung',
      'expérience utilisateur',
      'diseño de experiencia',
    ],
    related: ['frontend-development', 'graphic-design', 'content-creation'],
  },
  {
    id: 'cybersecurity',
    category: 'tech',
    labels: {
      en: 'Cybersecurity',
      de: 'Cybersicherheit',
      fr: 'Cybersécurité',
      sw: 'Usalama wa Mtandao',
      es: 'Ciberseguridad',
      pt: 'Cibersegurança',
      ar: 'الأمن السيبراني',
      zh: '网络安全',
      hi: 'साइबर सुरक्षा',
      ja: 'サイバーセキュリティ',
      ko: '사이버 보안',
      th: 'ความปลอดภัยไซเบอร์',
    },
    aliases: [
      'infosec',
      'information security',
      'IT security',
      'IT-Sicherheit',
      'Informationssicherheit',
      'sécurité informatique',
      'seguridad informática',
    ],
    related: ['cloud-architecture', 'devops', 'qa-engineering'],
  },
  {
    id: 'devops',
    category: 'tech',
    labels: {
      en: 'DevOps',
      de: 'DevOps',
      fr: 'DevOps',
      sw: 'DevOps',
      es: 'DevOps',
      pt: 'DevOps',
      ar: 'ديف أوبس',
      zh: '开发运维',
      hi: 'डेवऑप्स',
      ja: 'デブオプス',
      ko: '데브옵스',
      th: 'DevOps',
    },
    aliases: [
      'dev ops',
      'site reliability',
      'SRE',
      'infrastructure',
      'CI/CD',
      'Systemadministration',
      'administration système',
    ],
    related: ['cloud-architecture', 'software-engineering', 'backend-development'],
  },
  {
    id: 'cloud-architecture',
    category: 'tech',
    labels: {
      en: 'Cloud Architecture',
      de: 'Cloud-Architektur',
      fr: 'Architecture cloud',
      sw: 'Usanifu wa Wingu',
      es: 'Arquitectura Cloud',
      pt: 'Arquitetura Cloud',
      ar: 'هندسة السحابة',
      zh: '云架构',
      hi: 'क्लाउड आर्किटेक्चर',
      ja: 'クラウドアーキテクチャ',
      ko: '클라우드 아키텍처',
      th: 'สถาปัตยกรรมคลาวด์',
    },
    aliases: [
      'cloud computing',
      'AWS',
      'Azure',
      'GCP',
      'cloud engineer',
      'Cloud-Computing',
      'informatique en nuage',
    ],
    related: ['devops', 'cybersecurity', 'backend-development'],
  },
  {
    id: 'ai-ml',
    category: 'tech',
    labels: {
      en: 'AI/ML',
      de: 'KI/ML',
      fr: 'IA/ML',
      sw: 'AI/ML',
      es: 'IA/ML',
      pt: 'IA/ML',
      ar: 'الذكاء الاصطناعي',
      zh: '人工智能/机器学习',
      hi: 'एआई/एमएल',
      ja: 'AI/機械学習',
      ko: 'AI/머신러닝',
      th: 'AI/ML',
    },
    aliases: [
      'artificial intelligence',
      'machine learning',
      'AI',
      'ML',
      'deep learning',
      'neural networks',
      'Künstliche Intelligenz',
      'maschinelles Lernen',
      'intelligence artificielle',
      'apprentissage automatique',
      'inteligencia artificial',
      'aprendizaje automático',
    ],
    related: ['data-science', 'software-engineering', 'research'],
  },
  {
    id: 'mobile-development',
    category: 'tech',
    labels: {
      en: 'Mobile Development',
      de: 'Mobile Entwicklung',
      fr: 'Développement mobile',
      sw: 'Uendelezaji wa Simu',
      es: 'Desarrollo Móvil',
      pt: 'Desenvolvimento Mobile',
      ar: 'تطوير تطبيقات الجوال',
      zh: '移动开发',
      hi: 'मोबाइल डेवलपमेंट',
      ja: 'モバイル開発',
      ko: '모바일 개발',
      th: 'พัฒนาแอปมือถือ',
    },
    aliases: [
      'app development',
      'iOS development',
      'Android development',
      'mobile apps',
      'App-Entwicklung',
      'Mobilentwicklung',
      "développement d'applications",
      'desarrollo de apps',
    ],
    related: ['software-engineering', 'frontend-development', 'ux-design'],
  },
  {
    id: 'frontend-development',
    category: 'tech',
    labels: {
      en: 'Frontend Development',
      de: 'Frontend-Entwicklung',
      fr: 'Développement frontend',
      sw: 'Uendelezaji wa Frontend',
      es: 'Desarrollo Frontend',
      pt: 'Desenvolvimento Frontend',
      ar: 'تطوير الواجهة الأمامية',
      zh: '前端开发',
      hi: 'फ्रंटेंड डेवलपमेंट',
      ja: 'フロントエンド開発',
      ko: '프론트엔드 개발',
      th: 'พัฒนาฝั่งหน้าบ้าน',
    },
    aliases: [
      'front-end',
      'front end',
      'web development',
      'Webentwicklung',
      'développement web',
      'desarrollo web',
      'React',
      'Vue',
      'Angular',
    ],
    related: ['ux-design', 'backend-development', 'mobile-development'],
  },
  {
    id: 'backend-development',
    category: 'tech',
    labels: {
      en: 'Backend Development',
      de: 'Backend-Entwicklung',
      fr: 'Développement backend',
      sw: 'Uendelezaji wa Backend',
      es: 'Desarrollo Backend',
      pt: 'Desenvolvimento Backend',
      ar: 'تطوير الواجهة الخلفية',
      zh: '后端开发',
      hi: 'बैकएंड डेवलपमेंट',
      ja: 'バックエンド開発',
      ko: '백엔드 개발',
      th: 'พัฒนาฝั่งหลังบ้าน',
    },
    aliases: [
      'back-end',
      'back end',
      'server-side',
      'API development',
      'Serverseitige Entwicklung',
      'développement côté serveur',
      'desarrollo del lado del servidor',
    ],
    related: ['frontend-development', 'devops', 'cloud-architecture', 'software-engineering'],
  },
  {
    id: 'blockchain',
    category: 'tech',
    labels: {
      en: 'Blockchain',
      de: 'Blockchain',
      fr: 'Blockchain',
      sw: 'Blockchain',
      es: 'Blockchain',
      pt: 'Blockchain',
      ar: 'بلوكتشين',
      zh: '区块链',
      hi: 'ब्लॉकचेन',
      ja: 'ブロックチェーン',
      ko: '블록체인',
      th: 'บล็อกเชน',
    },
    aliases: [
      'crypto',
      'web3',
      'Web 3.0',
      'smart contracts',
      'DeFi',
      'distributed ledger',
      'Kryptowährung',
      'cryptomonnaie',
      'criptomoneda',
    ],
    related: ['software-engineering', 'cybersecurity', 'finance'],
  },
  {
    id: 'qa-engineering',
    category: 'tech',
    labels: {
      en: 'QA Engineering',
      de: 'Qualitätssicherung',
      fr: 'Assurance qualité',
      sw: 'Uhandisi wa QA',
      es: 'Ingeniería QA',
      pt: 'Engenharia de QA',
      ar: 'هندسة ضمان الجودة',
      zh: '质量保证工程',
      hi: 'क्यूए इंजीनियरिंग',
      ja: 'QAエンジニアリング',
      ko: 'QA 엔지니어링',
      th: 'วิศวกรรม QA',
    },
    aliases: [
      'QA',
      'quality assurance',
      'testing',
      'test engineering',
      'test automation',
      'Softwaretest',
      'Qualitätsingenieur',
      'contrôle qualité',
      'control de calidad',
    ],
    related: ['software-engineering', 'devops', 'cybersecurity'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Business
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'finance',
    category: 'business',
    labels: {
      en: 'Finance',
      de: 'Finanzen',
      fr: 'Finance',
      sw: 'Fedha',
      es: 'Finanzas',
      pt: 'Finanças',
      ar: 'المالية',
      zh: '金融',
      hi: 'वित्त',
      ja: 'ファイナンス',
      ko: '금융',
      th: 'การเงิน',
    },
    aliases: [
      'financial services',
      'banking',
      'investment',
      'Finanzwesen',
      'Bankwesen',
      'services financiers',
      'banque',
      'servicios financieros',
      'banca',
    ],
    related: ['accounting', 'business-analysis', 'consulting'],
  },
  {
    id: 'marketing',
    category: 'business',
    labels: {
      en: 'Marketing',
      de: 'Marketing',
      fr: 'Marketing',
      sw: 'Masoko',
      es: 'Marketing',
      pt: 'Marketing',
      ar: 'التسويق',
      zh: '市场营销',
      hi: 'मार्केटिंग',
      ja: 'マーケティング',
      ko: '마케팅',
      th: 'การตลาด',
    },
    aliases: [
      'digital marketing',
      'online marketing',
      'SEO',
      'SEM',
      'growth marketing',
      'Onlinemarketing',
      'marketing digital',
      'marketing numérique',
      'mercadotecnia',
    ],
    related: ['sales', 'content-creation', 'graphic-design'],
  },
  {
    id: 'sales',
    category: 'business',
    labels: {
      en: 'Sales',
      de: 'Vertrieb',
      fr: 'Ventes',
      sw: 'Mauzo',
      es: 'Ventas',
      pt: 'Vendas',
      ar: 'المبيعات',
      zh: '销售',
      hi: 'बिक्री',
      ja: '営業',
      ko: '영업',
      th: 'การขาย',
    },
    aliases: [
      'business development',
      'account management',
      'Verkauf',
      'Geschäftsentwicklung',
      'développement commercial',
      'desarrollo de negocios',
    ],
    related: ['marketing', 'consulting', 'entrepreneurship'],
  },
  {
    id: 'consulting',
    category: 'business',
    labels: {
      en: 'Consulting',
      de: 'Beratung',
      fr: 'Conseil',
      sw: 'Ushauri',
      es: 'Consultoría',
      pt: 'Consultoria',
      ar: 'الاستشارات',
      zh: '咨询',
      hi: 'परामर्श',
      ja: 'コンサルティング',
      ko: '컨설팅',
      th: 'ที่ปรึกษา',
    },
    aliases: [
      'management consulting',
      'strategy consulting',
      'Unternehmensberatung',
      'Managementberatung',
      'conseil en gestion',
      'consultoría estratégica',
    ],
    related: ['project-management', 'business-analysis', 'finance'],
  },
  {
    id: 'project-management',
    category: 'business',
    labels: {
      en: 'Project Management',
      de: 'Projektmanagement',
      fr: 'Gestion de projet',
      sw: 'Usimamizi wa Mradi',
      es: 'Gestión de Proyectos',
      pt: 'Gestão de Projetos',
      ar: 'إدارة المشاريع',
      zh: '项目管理',
      hi: 'परियोजना प्रबंधन',
      ja: 'プロジェクト管理',
      ko: '프로젝트 관리',
      th: 'การจัดการโครงการ',
    },
    aliases: [
      'PM',
      'program management',
      'scrum master',
      'agile',
      'Projektleitung',
      'Projektsteuerung',
      'chef de projet',
      'gestión de proyectos',
    ],
    related: ['consulting', 'business-analysis', 'entrepreneurship'],
  },
  {
    id: 'accounting',
    category: 'business',
    labels: {
      en: 'Accounting',
      de: 'Buchhaltung',
      fr: 'Comptabilité',
      sw: 'Uhasibu',
      es: 'Contabilidad',
      pt: 'Contabilidade',
      ar: 'المحاسبة',
      zh: '会计',
      hi: 'लेखांकन',
      ja: '会計',
      ko: '회계',
      th: 'การบัญชี',
    },
    aliases: [
      'bookkeeping',
      'auditing',
      'tax',
      'CPA',
      'Rechnungswesen',
      'Steuerberatung',
      'comptable',
      'contable',
      'contaduría',
    ],
    related: ['finance', 'business-analysis', 'consulting'],
  },
  {
    id: 'hr',
    category: 'business',
    labels: {
      en: 'HR',
      de: 'Personalwesen',
      fr: 'Ressources humaines',
      sw: 'Rasilimali Watu',
      es: 'Recursos Humanos',
      pt: 'Recursos Humanos',
      ar: 'الموارد البشرية',
      zh: '人力资源',
      hi: 'मानव संसाधन',
      ja: '人事',
      ko: '인사',
      th: 'ทรัพยากรบุคคล',
    },
    aliases: [
      'human resources',
      'people operations',
      'talent acquisition',
      'recruiting',
      'Personalabteilung',
      'Personalmanagement',
      'RH',
      'RRHH',
      'gestion du personnel',
    ],
    related: ['consulting', 'project-management', 'psychology'],
  },
  {
    id: 'entrepreneurship',
    category: 'business',
    labels: {
      en: 'Entrepreneurship',
      de: 'Unternehmertum',
      fr: 'Entrepreneuriat',
      sw: 'Ujasiriamali',
      es: 'Emprendimiento',
      pt: 'Empreendedorismo',
      ar: 'ريادة الأعمال',
      zh: '创业',
      hi: 'उद्यमिता',
      ja: '起業',
      ko: '기업가 정신',
      th: 'การเป็นผู้ประกอบการ',
    },
    aliases: [
      'startup',
      'founder',
      'Gründer',
      'Existenzgründung',
      'entrepreneur',
      'emprendedor',
      'empreendedor',
    ],
    related: ['sales', 'finance', 'project-management', 'marketing'],
  },
  {
    id: 'supply-chain',
    category: 'business',
    labels: {
      en: 'Supply Chain',
      de: 'Lieferkette',
      fr: "Chaîne d'approvisionnement",
      sw: 'Mnyororo wa Ugavi',
      es: 'Cadena de Suministro',
      pt: 'Cadeia de Suprimentos',
      ar: 'سلسلة التوريد',
      zh: '供应链',
      hi: 'आपूर्ति श्रृंखला',
      ja: 'サプライチェーン',
      ko: '공급망',
      th: 'ห่วงโซ่อุปทาน',
    },
    aliases: [
      'supply chain management',
      'SCM',
      'procurement',
      'Beschaffung',
      'Logistikmanagement',
      "gestion de la chaîne d'approvisionnement",
      'gestión de la cadena de suministro',
    ],
    related: ['logistics', 'project-management', 'consulting'],
  },
  {
    id: 'business-analysis',
    category: 'business',
    labels: {
      en: 'Business Analysis',
      de: 'Business-Analyse',
      fr: 'Analyse commerciale',
      sw: 'Uchambuzi wa Biashara',
      es: 'Análisis de Negocios',
      pt: 'Análise de Negócios',
      ar: 'تحليل الأعمال',
      zh: '商业分析',
      hi: 'व्यापार विश्लेषण',
      ja: 'ビジネス分析',
      ko: '비즈니스 분석',
      th: 'วิเคราะห์ธุรกิจ',
    },
    aliases: [
      'BA',
      'business analyst',
      'Geschäftsanalyse',
      "analyste d'affaires",
      'analista de negocios',
    ],
    related: ['data-science', 'consulting', 'finance', 'project-management'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Creative
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'photography',
    category: 'creative',
    labels: {
      en: 'Photography',
      de: 'Fotografie',
      fr: 'Photographie',
      sw: 'Upigaji Picha',
      es: 'Fotografía',
      pt: 'Fotografia',
      ar: 'التصوير الفوتوغرافي',
      zh: '摄影',
      hi: 'फोटोग्राफी',
      ja: '写真',
      ko: '사진',
      th: 'การถ่ายภาพ',
    },
    aliases: ['photographer', 'Fotograf', 'photographe', 'fotógrafo'],
    related: ['videography', 'graphic-design', 'content-creation'],
  },
  {
    id: 'videography',
    category: 'creative',
    labels: {
      en: 'Videography',
      de: 'Videografie',
      fr: 'Vidéographie',
      sw: 'Upigaji Video',
      es: 'Videografía',
      pt: 'Videografia',
      ar: 'تصوير الفيديو',
      zh: '摄像',
      hi: 'वीडियोग्राफी',
      ja: 'ビデオ撮影',
      ko: '비디오그래피',
      th: 'การถ่ายวิดีโอ',
    },
    aliases: [
      'video production',
      'filmmaking',
      'cinematography',
      'Videoproduktion',
      'Filmproduktion',
      'production vidéo',
      'producción de video',
    ],
    related: ['photography', 'animation', 'content-creation'],
  },
  {
    id: 'graphic-design',
    category: 'creative',
    labels: {
      en: 'Graphic Design',
      de: 'Grafikdesign',
      fr: 'Design graphique',
      sw: 'Muundo wa Picha',
      es: 'Diseño Gráfico',
      pt: 'Design Gráfico',
      ar: 'التصميم الجرافيكي',
      zh: '平面设计',
      hi: 'ग्राफिक डिज़ाइन',
      ja: 'グラフィックデザイン',
      ko: '그래픽 디자인',
      th: 'ออกแบบกราฟิก',
    },
    aliases: [
      'graphics',
      'visual design',
      'brand design',
      'Grafikdesigner',
      'graphiste',
      'diseñador gráfico',
    ],
    related: ['illustration', 'ux-design', 'content-creation'],
  },
  {
    id: 'music-production',
    category: 'creative',
    labels: {
      en: 'Music Production',
      de: 'Musikproduktion',
      fr: 'Production musicale',
      sw: 'Utengenezaji wa Muziki',
      es: 'Producción Musical',
      pt: 'Produção Musical',
      ar: 'إنتاج الموسيقى',
      zh: '音乐制作',
      hi: 'संगीत निर्माण',
      ja: '音楽制作',
      ko: '음악 제작',
      th: 'การผลิตเพลง',
    },
    aliases: [
      'music producer',
      'sound engineering',
      'audio production',
      'Musikproduzent',
      'Tontechnik',
      'producteur de musique',
      'productor musical',
    ],
    related: ['videography', 'content-creation', 'animation'],
  },
  {
    id: 'writing',
    category: 'creative',
    labels: {
      en: 'Writing',
      de: 'Schreiben',
      fr: 'Écriture',
      sw: 'Uandishi',
      es: 'Escritura',
      pt: 'Escrita',
      ar: 'الكتابة',
      zh: '写作',
      hi: 'लेखन',
      ja: 'ライティング',
      ko: '글쓰기',
      th: 'การเขียน',
    },
    aliases: [
      'copywriting',
      'technical writing',
      'creative writing',
      'author',
      'Autor',
      'Texter',
      'rédaction',
      'rédacteur',
      'escritor',
      'redacción',
    ],
    related: ['content-creation', 'academic-writing', 'translation'],
  },
  {
    id: 'animation',
    category: 'creative',
    labels: {
      en: 'Animation',
      de: 'Animation',
      fr: 'Animation',
      sw: 'Uhuishaji',
      es: 'Animación',
      pt: 'Animação',
      ar: 'الرسوم المتحركة',
      zh: '动画',
      hi: 'एनिमेशन',
      ja: 'アニメーション',
      ko: '애니메이션',
      th: 'แอนิเมชัน',
    },
    aliases: [
      'motion graphics',
      'motion design',
      '3D animation',
      '2D animation',
      'Animationsfilm',
      'Bewegtbild',
      'animateur',
      'animador',
    ],
    related: ['videography', 'graphic-design', 'illustration'],
  },
  {
    id: 'fashion-design',
    category: 'creative',
    labels: {
      en: 'Fashion Design',
      de: 'Modedesign',
      fr: 'Design de mode',
      sw: 'Muundo wa Mitindo',
      es: 'Diseño de Moda',
      pt: 'Design de Moda',
      ar: 'تصميم الأزياء',
      zh: '时装设计',
      hi: 'फैशन डिज़ाइन',
      ja: 'ファッションデザイン',
      ko: '패션 디자인',
      th: 'ออกแบบแฟชั่น',
    },
    aliases: [
      'fashion',
      'clothing design',
      'textile design',
      'Modedesigner',
      'stylisme',
      'diseño textil',
    ],
    related: ['interior-design', 'graphic-design', 'illustration'],
  },
  {
    id: 'interior-design',
    category: 'creative',
    labels: {
      en: 'Interior Design',
      de: 'Innenarchitektur',
      fr: "Design d'intérieur",
      sw: 'Muundo wa Ndani',
      es: 'Diseño de Interiores',
      pt: 'Design de Interiores',
      ar: 'التصميم الداخلي',
      zh: '室内设计',
      hi: 'इंटीरियर डिज़ाइन',
      ja: 'インテリアデザイン',
      ko: '인테리어 디자인',
      th: 'ออกแบบภายใน',
    },
    aliases: [
      'interior decorator',
      'Innenarchitekt',
      'Raumgestaltung',
      "décorateur d'intérieur",
      'decoración de interiores',
    ],
    related: ['fashion-design', 'construction', 'graphic-design'],
  },
  {
    id: 'content-creation',
    category: 'creative',
    labels: {
      en: 'Content Creation',
      de: 'Content-Erstellung',
      fr: 'Création de contenu',
      sw: 'Uundaji wa Maudhui',
      es: 'Creación de Contenido',
      pt: 'Criação de Conteúdo',
      ar: 'صناعة المحتوى',
      zh: '内容创作',
      hi: 'कंटेंट क्रिएशन',
      ja: 'コンテンツ制作',
      ko: '콘텐츠 제작',
      th: 'การสร้างเนื้อหา',
    },
    aliases: [
      'content creator',
      'influencer',
      'social media',
      'blogging',
      'vlogging',
      'Content Creator',
      'créateur de contenu',
      'creador de contenido',
    ],
    related: ['writing', 'photography', 'videography', 'marketing'],
  },
  {
    id: 'illustration',
    category: 'creative',
    labels: {
      en: 'Illustration',
      de: 'Illustration',
      fr: 'Illustration',
      sw: 'Michoro',
      es: 'Ilustración',
      pt: 'Ilustração',
      ar: 'الرسم التوضيحي',
      zh: '插画',
      hi: 'इलस्ट्रेशन',
      ja: 'イラストレーション',
      ko: '일러스트레이션',
      th: 'ภาพประกอบ',
    },
    aliases: [
      'illustrator',
      'digital illustration',
      'drawing',
      'Illustrator',
      'Zeichnen',
      'illustrateur',
      'ilustrador',
    ],
    related: ['graphic-design', 'animation', 'fashion-design'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Trades
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'construction',
    category: 'trades',
    labels: {
      en: 'Construction',
      de: 'Bauwesen',
      fr: 'Construction',
      sw: 'Ujenzi',
      es: 'Construcción',
      pt: 'Construção',
      ar: 'البناء',
      zh: '建筑',
      hi: 'निर्माण',
      ja: '建設',
      ko: '건설',
      th: 'การก่อสร้าง',
    },
    aliases: [
      'building',
      'civil engineering',
      'Bau',
      'Baugewerbe',
      'Hochbau',
      'bâtiment',
      'génie civil',
      'ingeniería civil',
    ],
    related: ['carpentry', 'masonry', 'electrical', 'plumbing'],
  },
  {
    id: 'electrical',
    category: 'trades',
    labels: {
      en: 'Electrical',
      de: 'Elektrotechnik',
      fr: 'Électricité',
      sw: 'Umeme',
      es: 'Electricidad',
      pt: 'Eletricidade',
      ar: 'الكهرباء',
      zh: '电气',
      hi: 'विद्युत',
      ja: '電気工事',
      ko: '전기',
      th: 'ไฟฟ้า',
    },
    aliases: [
      'electrician',
      'electrical engineering',
      'wiring',
      'Elektriker',
      'Elektroinstallation',
      'électricien',
      'electricista',
    ],
    related: ['construction', 'hvac', 'plumbing'],
  },
  {
    id: 'plumbing',
    category: 'trades',
    labels: {
      en: 'Plumbing',
      de: 'Klempnerei',
      fr: 'Plomberie',
      sw: 'Bomba',
      es: 'Fontanería',
      pt: 'Encanamento',
      ar: 'السباكة',
      zh: '水暖',
      hi: 'नलसाजी',
      ja: '配管工事',
      ko: '배관',
      th: 'ประปา',
    },
    aliases: [
      'plumber',
      'pipe fitting',
      'Klempner',
      'Sanitärinstallation',
      'plombier',
      'fontanero',
      'encanador',
    ],
    related: ['construction', 'electrical', 'hvac'],
  },
  {
    id: 'mechanics',
    category: 'trades',
    labels: {
      en: 'Mechanics',
      de: 'Mechanik',
      fr: 'Mécanique',
      sw: 'Ufundi Mitambo',
      es: 'Mecánica',
      pt: 'Mecânica',
      ar: 'الميكانيكا',
      zh: '机械',
      hi: 'मैकेनिक्स',
      ja: '機械整備',
      ko: '기계',
      th: 'ช่างกล',
    },
    aliases: [
      'mechanic',
      'auto repair',
      'automotive',
      'Mechaniker',
      'KFZ-Mechaniker',
      'Automechaniker',
      'mécanicien',
      'mecánico',
    ],
    related: ['welding', 'electrical', 'construction'],
  },
  {
    id: 'welding',
    category: 'trades',
    labels: {
      en: 'Welding',
      de: 'Schweißen',
      fr: 'Soudure',
      sw: 'Uchomeleaji',
      es: 'Soldadura',
      pt: 'Soldagem',
      ar: 'اللحام',
      zh: '焊接',
      hi: 'वेल्डिंग',
      ja: '溶接',
      ko: '용접',
      th: 'งานเชื่อม',
    },
    aliases: ['welder', 'Schweißer', 'soudeur', 'soldador'],
    related: ['mechanics', 'construction', 'carpentry'],
  },
  {
    id: 'carpentry',
    category: 'trades',
    labels: {
      en: 'Carpentry',
      de: 'Schreinerei',
      fr: 'Menuiserie',
      sw: 'Useremala',
      es: 'Carpintería',
      pt: 'Carpintaria',
      ar: 'النجارة',
      zh: '木工',
      hi: 'बढ़ईगीरी',
      ja: '大工仕事',
      ko: '목공',
      th: 'งานช่างไม้',
    },
    aliases: [
      'carpenter',
      'woodworking',
      'Schreiner',
      'Tischler',
      'Zimmermann',
      'menuisier',
      'charpentier',
      'carpintero',
    ],
    related: ['construction', 'masonry', 'interior-design'],
  },
  {
    id: 'masonry',
    category: 'trades',
    labels: {
      en: 'Masonry',
      de: 'Maurerhandwerk',
      fr: 'Maçonnerie',
      sw: 'Uashi',
      es: 'Albañilería',
      pt: 'Alvenaria',
      ar: 'البناء بالطوب',
      zh: '砌筑',
      hi: 'राजमिस्त्री',
      ja: '石工',
      ko: '석공',
      th: 'งานก่ออิฐ',
    },
    aliases: ['mason', 'bricklayer', 'stonework', 'Maurer', 'maçon', 'albañil', 'pedreiro'],
    related: ['construction', 'carpentry', 'plumbing'],
  },
  {
    id: 'hvac',
    category: 'trades',
    labels: {
      en: 'HVAC',
      de: 'Heizung, Lüftung, Klimatechnik',
      fr: 'CVC (Chauffage, ventilation, climatisation)',
      sw: 'HVAC',
      es: 'Climatización',
      pt: 'AVAC',
      ar: 'تكييف وتبريد',
      zh: '暖通空调',
      hi: 'एचवीएसी',
      ja: '空調設備',
      ko: '냉난방 공조',
      th: 'ระบบปรับอากาศ',
    },
    aliases: [
      'heating',
      'ventilation',
      'air conditioning',
      'Klimaanlage',
      'Heizungsbauer',
      'HLK',
      'climatisation',
      'chauffagiste',
      'aire acondicionado',
    ],
    related: ['electrical', 'plumbing', 'construction'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Health
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'medicine',
    category: 'health',
    labels: {
      en: 'Medicine',
      de: 'Medizin',
      fr: 'Médecine',
      sw: 'Tiba',
      es: 'Medicina',
      pt: 'Medicina',
      ar: 'الطب',
      zh: '医学',
      hi: 'चिकित्सा',
      ja: '医学',
      ko: '의학',
      th: 'การแพทย์',
    },
    aliases: ['doctor', 'physician', 'medical', 'Arzt', 'Ärztin', 'médecin', 'docteur', 'médico'],
    related: ['nursing', 'pharmacy', 'public-health', 'dentistry'],
  },
  {
    id: 'nursing',
    category: 'health',
    labels: {
      en: 'Nursing',
      de: 'Krankenpflege',
      fr: 'Soins infirmiers',
      sw: 'Uuguzi',
      es: 'Enfermería',
      pt: 'Enfermagem',
      ar: 'التمريض',
      zh: '护理',
      hi: 'नर्सिंग',
      ja: '看護',
      ko: '간호',
      th: 'การพยาบาล',
    },
    aliases: [
      'nurse',
      'registered nurse',
      'RN',
      'Krankenschwester',
      'Krankenpfleger',
      'Pflegefachkraft',
      'infirmier',
      'infirmière',
      'enfermero',
      'enfermera',
    ],
    related: ['medicine', 'public-health', 'physiotherapy'],
  },
  {
    id: 'pharmacy',
    category: 'health',
    labels: {
      en: 'Pharmacy',
      de: 'Pharmazie',
      fr: 'Pharmacie',
      sw: 'Famasia',
      es: 'Farmacia',
      pt: 'Farmácia',
      ar: 'الصيدلة',
      zh: '药学',
      hi: 'फार्मेसी',
      ja: '薬学',
      ko: '약학',
      th: 'เภสัชกรรม',
    },
    aliases: [
      'pharmacist',
      'Apotheker',
      'Apothekerin',
      'pharmacien',
      'pharmacienne',
      'farmacéutico',
    ],
    related: ['medicine', 'nutrition', 'public-health'],
  },
  {
    id: 'nutrition',
    category: 'health',
    labels: {
      en: 'Nutrition',
      de: 'Ernährungswissenschaft',
      fr: 'Nutrition',
      sw: 'Lishe',
      es: 'Nutrición',
      pt: 'Nutrição',
      ar: 'التغذية',
      zh: '营养学',
      hi: 'पोषण',
      ja: '栄養学',
      ko: '영양학',
      th: 'โภชนาการ',
    },
    aliases: [
      'nutritionist',
      'dietitian',
      'dietician',
      'Ernährungsberater',
      'Ernährungsberaterin',
      'diététicien',
      'nutricionista',
      'nutriólogo',
    ],
    related: ['medicine', 'public-health', 'culinary-arts'],
  },
  {
    id: 'physiotherapy',
    category: 'health',
    labels: {
      en: 'Physiotherapy',
      de: 'Physiotherapie',
      fr: 'Kinésithérapie',
      sw: 'Tiba ya Mwili',
      es: 'Fisioterapia',
      pt: 'Fisioterapia',
      ar: 'العلاج الطبيعي',
      zh: '物理治疗',
      hi: 'फिजियोथेरेपी',
      ja: '理学療法',
      ko: '물리치료',
      th: 'กายภาพบำบัด',
    },
    aliases: [
      'physical therapy',
      'physio',
      'PT',
      'Physiotherapeut',
      'kinésithérapeute',
      'fisioterapeuta',
    ],
    related: ['medicine', 'nursing', 'psychology'],
  },
  {
    id: 'psychology',
    category: 'health',
    labels: {
      en: 'Psychology',
      de: 'Psychologie',
      fr: 'Psychologie',
      sw: 'Saikolojia',
      es: 'Psicología',
      pt: 'Psicologia',
      ar: 'علم النفس',
      zh: '心理学',
      hi: 'मनोविज्ञान',
      ja: '心理学',
      ko: '심리학',
      th: 'จิตวิทยา',
    },
    aliases: [
      'psychologist',
      'therapist',
      'counseling',
      'counselling',
      'mental health',
      'Psychologe',
      'Therapeut',
      'psychologue',
      'thérapeute',
      'psicólogo',
    ],
    related: ['medicine', 'social-work', 'hr'],
  },
  {
    id: 'dentistry',
    category: 'health',
    labels: {
      en: 'Dentistry',
      de: 'Zahnmedizin',
      fr: 'Dentisterie',
      sw: 'Udaktari wa Meno',
      es: 'Odontología',
      pt: 'Odontologia',
      ar: 'طب الأسنان',
      zh: '牙科',
      hi: 'दंत चिकित्सा',
      ja: '歯科',
      ko: '치과',
      th: 'ทันตกรรม',
    },
    aliases: ['dentist', 'dental', 'Zahnarzt', 'Zahnärztin', 'dentiste', 'dentista', 'odontólogo'],
    related: ['medicine', 'public-health', 'nursing'],
  },
  {
    id: 'public-health',
    category: 'health',
    labels: {
      en: 'Public Health',
      de: 'Öffentliches Gesundheitswesen',
      fr: 'Santé publique',
      sw: 'Afya ya Umma',
      es: 'Salud Pública',
      pt: 'Saúde Pública',
      ar: 'الصحة العامة',
      zh: '公共卫生',
      hi: 'सार्वजनिक स्वास्थ्य',
      ja: '公衆衛生',
      ko: '공중보건',
      th: 'สาธารณสุข',
    },
    aliases: [
      'epidemiology',
      'global health',
      'community health',
      'Gesundheitswesen',
      'santé communautaire',
      'salud comunitaria',
    ],
    related: ['medicine', 'nursing', 'nutrition'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Education
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'teaching',
    category: 'education',
    labels: {
      en: 'Teaching',
      de: 'Unterrichten',
      fr: 'Enseignement',
      sw: 'Ufundishaji',
      es: 'Enseñanza',
      pt: 'Ensino',
      ar: 'التدريس',
      zh: '教学',
      hi: 'शिक्षण',
      ja: '教育',
      ko: '교육',
      th: 'การสอน',
    },
    aliases: [
      'teacher',
      'educator',
      'instructor',
      'Lehrer',
      'Lehrerin',
      'Pädagoge',
      'enseignant',
      'professeur',
      'profesor',
      'maestro',
    ],
    related: ['tutoring', 'curriculum-design', 'language-instruction'],
  },
  {
    id: 'tutoring',
    category: 'education',
    labels: {
      en: 'Tutoring',
      de: 'Nachhilfe',
      fr: 'Tutorat',
      sw: 'Kufundisha',
      es: 'Tutoría',
      pt: 'Tutoria',
      ar: 'التدريس الخصوصي',
      zh: '辅导',
      hi: 'ट्यूशन',
      ja: '個別指導',
      ko: '과외',
      th: 'การติว',
    },
    aliases: ['tutor', 'private tutor', 'Nachhilfelehrer', 'tuteur', 'tutor privado'],
    related: ['teaching', 'language-instruction', 'academic-writing'],
  },
  {
    id: 'curriculum-design',
    category: 'education',
    labels: {
      en: 'Curriculum Design',
      de: 'Lehrplangestaltung',
      fr: 'Conception de programmes',
      sw: 'Muundo wa Mtaala',
      es: 'Diseño Curricular',
      pt: 'Design Curricular',
      ar: 'تصميم المناهج',
      zh: '课程设计',
      hi: 'पाठ्यक्रम डिज़ाइन',
      ja: 'カリキュラム設計',
      ko: '교육 과정 설계',
      th: 'การออกแบบหลักสูตร',
    },
    aliases: [
      'instructional design',
      'course design',
      'Lehrplanentwicklung',
      'Unterrichtsgestaltung',
      'conception pédagogique',
      'diseño instruccional',
    ],
    related: ['teaching', 'research', 'academic-writing'],
  },
  {
    id: 'language-instruction',
    category: 'education',
    labels: {
      en: 'Language Instruction',
      de: 'Sprachunterricht',
      fr: 'Enseignement des langues',
      sw: 'Kufundisha Lugha',
      es: 'Enseñanza de Idiomas',
      pt: 'Ensino de Idiomas',
      ar: 'تعليم اللغات',
      zh: '语言教学',
      hi: 'भाषा शिक्षण',
      ja: '語学教育',
      ko: '어학 교육',
      th: 'การสอนภาษา',
    },
    aliases: [
      'language teaching',
      'ESL',
      'EFL',
      'TEFL',
      'language teacher',
      'Sprachlehrer',
      'professeur de langues',
      'profesor de idiomas',
    ],
    related: ['teaching', 'tutoring', 'translation'],
  },
  {
    id: 'research',
    category: 'education',
    labels: {
      en: 'Research',
      de: 'Forschung',
      fr: 'Recherche',
      sw: 'Utafiti',
      es: 'Investigación',
      pt: 'Pesquisa',
      ar: 'البحث العلمي',
      zh: '研究',
      hi: 'अनुसंधान',
      ja: '研究',
      ko: '연구',
      th: 'การวิจัย',
    },
    aliases: [
      'researcher',
      'scientist',
      'academic research',
      'Forscher',
      'Wissenschaftler',
      'chercheur',
      'investigador',
      'pesquisador',
    ],
    related: ['academic-writing', 'data-science', 'teaching'],
  },
  {
    id: 'academic-writing',
    category: 'education',
    labels: {
      en: 'Academic Writing',
      de: 'Wissenschaftliches Schreiben',
      fr: 'Rédaction académique',
      sw: 'Uandishi wa Kitaaluma',
      es: 'Escritura Académica',
      pt: 'Escrita Acadêmica',
      ar: 'الكتابة الأكاديمية',
      zh: '学术写作',
      hi: 'शैक्षणिक लेखन',
      ja: '学術論文執筆',
      ko: '학술 글쓰기',
      th: 'การเขียนเชิงวิชาการ',
    },
    aliases: [
      'scientific writing',
      'scholarly writing',
      'wissenschaftliches Schreiben',
      'écriture scientifique',
      'redacción académica',
    ],
    related: ['research', 'writing', 'curriculum-design'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Nature
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'safari-guide',
    category: 'nature',
    labels: {
      en: 'Safari Guide',
      de: 'Safari-Führer',
      fr: 'Guide de safari',
      sw: 'Kiongozi wa Safari',
      es: 'Guía de Safari',
      pt: 'Guia de Safari',
      ar: 'مرشد رحلات السفاري',
      zh: '野生动物导游',
      hi: 'सफारी गाइड',
      ja: 'サファリガイド',
      ko: '사파리 가이드',
      th: 'ไกด์ซาฟารี',
    },
    aliases: [
      'wildlife guide',
      'game ranger',
      'game drive guide',
      'Wildhüter',
      'Ranger',
      'guide animalier',
      'guía de vida silvestre',
    ],
    related: ['conservation', 'tourism', 'veterinary'],
  },
  {
    id: 'conservation',
    category: 'nature',
    labels: {
      en: 'Conservation',
      de: 'Naturschutz',
      fr: 'Conservation',
      sw: 'Uhifadhi',
      es: 'Conservación',
      pt: 'Conservação',
      ar: 'الحفاظ على البيئة',
      zh: '自然保护',
      hi: 'संरक्षण',
      ja: '自然保護',
      ko: '자연 보전',
      th: 'การอนุรักษ์',
    },
    aliases: [
      'environmental conservation',
      'wildlife conservation',
      'ecology',
      'Umweltschutz',
      'Artenschutz',
      'conservation de la nature',
      'conservación ambiental',
    ],
    related: ['safari-guide', 'marine-biology', 'forestry'],
  },
  {
    id: 'marine-biology',
    category: 'nature',
    labels: {
      en: 'Marine Biology',
      de: 'Meeresbiologie',
      fr: 'Biologie marine',
      sw: 'Biolojia ya Bahari',
      es: 'Biología Marina',
      pt: 'Biologia Marinha',
      ar: 'علم الأحياء البحرية',
      zh: '海洋生物学',
      hi: 'समुद्री जीवविज्ञान',
      ja: '海洋生物学',
      ko: '해양 생물학',
      th: 'ชีววิทยาทางทะเล',
    },
    aliases: [
      'marine science',
      'ocean science',
      'oceanography',
      'Meereswissenschaft',
      'biologie océanique',
      'ciencias del mar',
    ],
    related: ['conservation', 'research', 'veterinary'],
  },
  {
    id: 'agriculture',
    category: 'nature',
    labels: {
      en: 'Agriculture',
      de: 'Landwirtschaft',
      fr: 'Agriculture',
      sw: 'Kilimo',
      es: 'Agricultura',
      pt: 'Agricultura',
      ar: 'الزراعة',
      zh: '农业',
      hi: 'कृषि',
      ja: '農業',
      ko: '농업',
      th: 'เกษตรกรรม',
    },
    aliases: [
      'farming',
      'agribusiness',
      'horticulture',
      'Ackerbau',
      'Agrarwirtschaft',
      'Landwirt',
      'agriculteur',
      'agricultor',
    ],
    related: ['forestry', 'veterinary', 'conservation'],
  },
  {
    id: 'forestry',
    category: 'nature',
    labels: {
      en: 'Forestry',
      de: 'Forstwirtschaft',
      fr: 'Sylviculture',
      sw: 'Misitu',
      es: 'Silvicultura',
      pt: 'Silvicultura',
      ar: 'الحراجة',
      zh: '林业',
      hi: 'वानिकी',
      ja: '林業',
      ko: '임업',
      th: 'วนศาสตร์',
    },
    aliases: [
      'forest management',
      'arboriculture',
      'Forstwirt',
      'Waldwirtschaft',
      'forestier',
      'silvicultor',
    ],
    related: ['agriculture', 'conservation', 'marine-biology'],
  },
  {
    id: 'veterinary',
    category: 'nature',
    labels: {
      en: 'Veterinary',
      de: 'Tiermedizin',
      fr: 'Médecine vétérinaire',
      sw: 'Tiba ya Wanyama',
      es: 'Veterinaria',
      pt: 'Veterinária',
      ar: 'الطب البيطري',
      zh: '兽医',
      hi: 'पशु चिकित्सा',
      ja: '獣医学',
      ko: '수의학',
      th: 'สัตวแพทย์',
    },
    aliases: [
      'vet',
      'veterinarian',
      'animal doctor',
      'Tierarzt',
      'Tierärztin',
      'vétérinaire',
      'veterinario',
    ],
    related: ['safari-guide', 'conservation', 'agriculture'],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // Service
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'hospitality',
    category: 'service',
    labels: {
      en: 'Hospitality',
      de: 'Gastgewerbe',
      fr: 'Hôtellerie',
      sw: 'Ukarimu',
      es: 'Hostelería',
      pt: 'Hotelaria',
      ar: 'الضيافة',
      zh: '酒店管理',
      hi: 'आतिथ्य',
      ja: 'ホスピタリティ',
      ko: '호텔경영',
      th: 'การโรงแรม',
    },
    aliases: [
      'hotel management',
      'hotel industry',
      'Hotelmanagement',
      'Hotellerie',
      'gestion hôtelière',
      'gestión hotelera',
    ],
    related: ['tourism', 'culinary-arts', 'event-planning'],
  },
  {
    id: 'culinary-arts',
    category: 'service',
    labels: {
      en: 'Culinary Arts',
      de: 'Kochkunst',
      fr: 'Arts culinaires',
      sw: 'Sanaa ya Kupika',
      es: 'Artes Culinarias',
      pt: 'Artes Culinárias',
      ar: 'فنون الطهي',
      zh: '烹饪艺术',
      hi: 'पाक कला',
      ja: '料理',
      ko: '요리',
      th: 'ศิลปะการทำอาหาร',
    },
    aliases: [
      'chef',
      'cooking',
      'cuisine',
      'Koch',
      'Köchin',
      'Küchenchef',
      'cuisinier',
      'cocinero',
      'cozinheiro',
    ],
    related: ['hospitality', 'nutrition', 'event-planning'],
  },
  {
    id: 'event-planning',
    category: 'service',
    labels: {
      en: 'Event Planning',
      de: 'Eventplanung',
      fr: "Organisation d'événements",
      sw: 'Kupanga Matukio',
      es: 'Organización de Eventos',
      pt: 'Planejamento de Eventos',
      ar: 'تنظيم الفعاليات',
      zh: '活动策划',
      hi: 'इवेंट प्लानिंग',
      ja: 'イベント企画',
      ko: '이벤트 기획',
      th: 'การจัดงาน',
    },
    aliases: [
      'event management',
      'event organizer',
      'Veranstaltungsplanung',
      'Eventmanagement',
      "organisateur d'événements",
      'organizador de eventos',
    ],
    related: ['hospitality', 'culinary-arts', 'logistics'],
  },
  {
    id: 'security',
    category: 'service',
    labels: {
      en: 'Security',
      de: 'Sicherheitsdienst',
      fr: 'Sécurité',
      sw: 'Usalama',
      es: 'Seguridad',
      pt: 'Segurança',
      ar: 'الأمن',
      zh: '安保',
      hi: 'सुरक्षा',
      ja: 'セキュリティ',
      ko: '보안',
      th: 'รักษาความปลอดภัย',
    },
    aliases: [
      'security guard',
      'security services',
      'protection',
      'Sicherheit',
      'Wachschutz',
      'agent de sécurité',
      'guardia de seguridad',
    ],
    related: ['logistics', 'hospitality', 'cybersecurity'],
  },
  {
    id: 'logistics',
    category: 'service',
    labels: {
      en: 'Logistics',
      de: 'Logistik',
      fr: 'Logistique',
      sw: 'Vifaa',
      es: 'Logística',
      pt: 'Logística',
      ar: 'الخدمات اللوجستية',
      zh: '物流',
      hi: 'लॉजिस्टिक्स',
      ja: '物流',
      ko: '물류',
      th: 'โลจิสติกส์',
    },
    aliases: [
      'shipping',
      'freight',
      'distribution',
      'warehousing',
      'Spedition',
      'Lagerverwaltung',
      'logisticien',
      'distribución',
    ],
    related: ['supply-chain', 'event-planning', 'security'],
  },
  {
    id: 'tourism',
    category: 'service',
    labels: {
      en: 'Tourism',
      de: 'Tourismus',
      fr: 'Tourisme',
      sw: 'Utalii',
      es: 'Turismo',
      pt: 'Turismo',
      ar: 'السياحة',
      zh: '旅游',
      hi: 'पर्यटन',
      ja: '観光',
      ko: '관광',
      th: 'การท่องเที่ยว',
    },
    aliases: [
      'travel',
      'tour guide',
      'travel agent',
      'Reiseführer',
      'Reiseveranstalter',
      'guide touristique',
      'agente de viajes',
    ],
    related: ['hospitality', 'safari-guide', 'event-planning'],
  },
  {
    id: 'translation',
    category: 'service',
    labels: {
      en: 'Translation',
      de: 'Übersetzung',
      fr: 'Traduction',
      sw: 'Utafsiri',
      es: 'Traducción',
      pt: 'Tradução',
      ar: 'الترجمة',
      zh: '翻译',
      hi: 'अनुवाद',
      ja: '翻訳',
      ko: '번역',
      th: 'การแปล',
    },
    aliases: [
      'translator',
      'interpreter',
      'interpreting',
      'localization',
      'Übersetzer',
      'Dolmetscher',
      'Lokalisierung',
      'traducteur',
      'interprète',
      'traductor',
      'intérprete',
    ],
    related: ['language-instruction', 'writing', 'content-creation'],
  },
  {
    id: 'social-work',
    category: 'service',
    labels: {
      en: 'Social Work',
      de: 'Sozialarbeit',
      fr: 'Travail social',
      sw: 'Kazi ya Jamii',
      es: 'Trabajo Social',
      pt: 'Serviço Social',
      ar: 'العمل الاجتماعي',
      zh: '社会工作',
      hi: 'सामाजिक कार्य',
      ja: 'ソーシャルワーク',
      ko: '사회복지',
      th: 'สังคมสงเคราะห์',
    },
    aliases: [
      'social worker',
      'community work',
      'community development',
      'Sozialarbeiter',
      'Sozialpädagoge',
      'travailleur social',
      'trabajador social',
      'assistente social',
    ],
    related: ['psychology', 'public-health', 'teaching'],
  },
]

// ---------------------------------------------------------------------------
// Lookup index — built once on module load for O(1) resolution
// ---------------------------------------------------------------------------

/** Maps lowercase label/alias → canonical skill ID */
const _lookupIndex: Map<string, string> = new Map()

/** Maps skill ID → SkillCanonical for fast retrieval */
const _idIndex: Map<string, SkillCanonical> = new Map()

// Build indexes
for (const skill of SKILL_REGISTRY) {
  _idIndex.set(skill.id, skill)

  // Index all labels
  for (const lang of Object.keys(skill.labels)) {
    _lookupIndex.set(skill.labels[lang].toLowerCase(), skill.id)
  }

  // Index all aliases
  for (const alias of skill.aliases) {
    _lookupIndex.set(alias.toLowerCase(), skill.id)
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Resolve any string (in any language) to a canonical skill ID.
 * Matches against all labels and aliases, case-insensitive.
 *
 * @param input - Skill name in any language (e.g. "Softwareentwicklung", "coding", "développement logiciel")
 * @returns Canonical skill ID or null if no match
 *
 * @example
 * resolveSkillId('Softwareentwicklung') // 'software-engineering'
 * resolveSkillId('coding')              // 'software-engineering'
 * resolveSkillId('unknown skill')       // null
 */
export function resolveSkillId(input: string): string | null {
  return _lookupIndex.get(input.toLowerCase().trim()) ?? null
}

/**
 * Get the localized label for a skill.
 * Falls back to English if the requested language is not available.
 *
 * @param id - Canonical skill ID
 * @param lang - Language code (e.g. 'de', 'fr', 'sw')
 * @returns Localized label or English fallback, empty string if skill not found
 *
 * @example
 * getSkillLabel('software-engineering', 'de') // 'Softwareentwicklung'
 * getSkillLabel('software-engineering', 'xx') // 'Software Engineering' (en fallback)
 */
export function getSkillLabel(id: string, lang: string): string {
  const skill = _idIndex.get(id)
  if (!skill) return ''
  return skill.labels[lang] ?? skill.labels['en'] ?? ''
}

/**
 * Get all skills in a given category.
 *
 * @param category - Category name (tech, business, creative, trades, health, education, nature, service)
 * @returns Array of matching SkillCanonical entries
 *
 * @example
 * getSkillsByCategory('tech') // [{ id: 'software-engineering', ... }, ...]
 */
export function getSkillsByCategory(category: string): SkillCanonical[] {
  return SKILL_REGISTRY.filter((s) => s.category === category)
}

/**
 * Check if two strings (in any language) resolve to the same canonical skill.
 * Useful for cross-language matching in the Compass engine.
 *
 * @param a - First skill string (any language)
 * @param b - Second skill string (any language)
 * @returns true if both resolve to the same skill ID
 *
 * @example
 * areSkillsEquivalent('Softwareentwicklung', 'Software Engineering') // true
 * areSkillsEquivalent('coding', 'développement logiciel')            // true
 * areSkillsEquivalent('cooking', 'coding')                           // false
 */
export function areSkillsEquivalent(a: string, b: string): boolean {
  const idA = resolveSkillId(a)
  const idB = resolveSkillId(b)
  if (idA === null || idB === null) return false
  return idA === idB
}

/**
 * Get related/complementary skills for a given skill ID.
 * Useful for suggesting additional skills or broadening search results.
 *
 * @param id - Canonical skill ID
 * @returns Array of related SkillCanonical entries
 *
 * @example
 * getRelatedSkills('frontend-development') // [ux-design, backend-development, mobile-development]
 */
export function getRelatedSkills(id: string): SkillCanonical[] {
  const skill = _idIndex.get(id)
  if (!skill) return []
  return skill.related
    .map((relId) => _idIndex.get(relId))
    .filter((s): s is SkillCanonical => s !== undefined)
}

/**
 * Search skills by partial match in any language.
 * Optionally biased toward a specific language (searched first).
 *
 * @param query - Partial search string
 * @param lang - Optional language code to prioritize
 * @returns Matching SkillCanonical entries, sorted by relevance (exact label match first)
 *
 * @example
 * searchSkills('dev')        // [software-engineering, devops, frontend-development, backend-development, mobile-development]
 * searchSkills('Entwickl', 'de') // [software-engineering, frontend-development, backend-development, mobile-development]
 */
export function searchSkills(query: string, lang?: string): SkillCanonical[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const exactMatches: SkillCanonical[] = []
  const partialMatches: SkillCanonical[] = []
  const seen = new Set<string>()

  for (const skill of SKILL_REGISTRY) {
    if (seen.has(skill.id)) continue

    // Check exact match on any label or alias
    let isExact = false
    for (const label of Object.values(skill.labels)) {
      if (label.toLowerCase() === q) {
        isExact = true
        break
      }
    }
    if (!isExact) {
      for (const alias of skill.aliases) {
        if (alias.toLowerCase() === q) {
          isExact = true
          break
        }
      }
    }

    if (isExact) {
      seen.add(skill.id)
      exactMatches.push(skill)
      continue
    }

    // Check partial match — prioritize the requested language
    let isPartial = false
    if (lang && skill.labels[lang]) {
      if (skill.labels[lang].toLowerCase().includes(q)) {
        isPartial = true
      }
    }

    if (!isPartial) {
      for (const label of Object.values(skill.labels)) {
        if (label.toLowerCase().includes(q)) {
          isPartial = true
          break
        }
      }
    }

    if (!isPartial) {
      for (const alias of skill.aliases) {
        if (alias.toLowerCase().includes(q)) {
          isPartial = true
          break
        }
      }
    }

    if (isPartial) {
      seen.add(skill.id)
      partialMatches.push(skill)
    }
  }

  return [...exactMatches, ...partialMatches]
}

/**
 * Get all skill labels for a given language.
 * Useful for autocomplete dropdowns and suggestion UIs.
 * Falls back to English for skills without a translation in the requested language.
 *
 * @param lang - Language code (e.g. 'de', 'fr', 'sw')
 * @returns Array of { id, label } sorted alphabetically by label
 *
 * @example
 * getAllLabelsForLang('de') // [{ id: 'accounting', label: 'Buchhaltung' }, ...]
 */
export function getAllLabelsForLang(lang: string): Array<{ id: string; label: string }> {
  return SKILL_REGISTRY.map((skill) => ({
    id: skill.id,
    label: skill.labels[lang] ?? skill.labels['en'] ?? skill.id,
  })).sort((a, b) => a.label.localeCompare(b.label, lang))
}
