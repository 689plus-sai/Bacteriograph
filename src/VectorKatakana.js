
export const VECTOR_KATAKANA = {
    // --- A Row ---
    'ア': [
        { type: 'path', points: [[15, 25], [85, 25]], weight: 1.2 },
        { type: 'curve', p1: [85, 25], p2: [35, 80], c1: [55, 50], weight: 1.2 },
        { type: 'curve', p1: [80, 28], p2: [90, 75], c1: [85, 50], weight: 1.2 }
    ],
    'イ': [
        { type: 'curve', p1: [75, 15], p2: [20, 65], c1: [60, 30], weight: 1.2 },
        { type: 'line', p1: [50, 15], p2: [50, 90], weight: 1.2 }
    ],
    'ウ': [
        { type: 'line', p1: [50, 10], p2: [50, 25], weight: 1.2 }, // Top Pip
        { type: 'path', points: [[20, 30], [20, 60]], weight: 1.2 }, // Front Leg
        { type: 'path', points: [[20, 30], [80, 30]], weight: 1.2 }, // Shoulder
        { type: 'curve', p1: [80, 30], p2: [25, 85], c1: [70, 60], weight: 1.2 } // Sweep
    ],
    'エ': [
        { type: 'line', p1: [25, 20], p2: [75, 20], weight: 1.2 }, // Top
        { type: 'line', p1: [50, 20], p2: [50, 80], weight: 1.2 }, // Vert
        { type: 'line', p1: [15, 80], p2: [85, 80], weight: 1.2 }  // Bot
    ],
    'オ': [
        { type: 'line', p1: [20, 25], p2: [80, 25], weight: 1.2 }, // Horz
        { type: 'line', p1: [50, 15], p2: [50, 65], weight: 1.2 }, // Vert Top
        { type: 'curve', p1: [50, 65], p2: [25, 85], c1: [45, 80], weight: 1.2 }, // Hook Left
        { type: 'line', p1: [40, 40], p2: [30, 55], weight: 1.2 }, // Left Dash
        { type: 'line', p1: [60, 35], p2: [75, 45], weight: 1.2 }  // Right Dot
    ],

    // --- Ka Row ---
    'カ': [
        { type: 'path', points: [[20, 25], [85, 25]], weight: 1.2 }, // Horz
        { type: 'curve', p1: [85, 25], p2: [55, 85], c1: [85, 60], weight: 1.2 }, // Hook
        { type: 'curve', p1: [55, 25], p2: [20, 80], c1: [40, 55], weight: 1.2 }  // Crossing Dash
    ],
    'キ': [
        { type: 'line', p1: [25, 30], p2: [75, 25], weight: 1.2 }, // Top Horz
        { type: 'line', p1: [20, 50], p2: [80, 45], weight: 1.2 }, // Bot Horz
        { type: 'curve', p1: [50, 15], p2: [60, 85], c1: [45, 50], weight: 1.2 } // Diag Vert
    ],
    'ク': [
        { type: 'curve', p1: [45, 15], p2: [30, 35], c1: [40, 25], weight: 1.2 }, // Dash
        { type: 'path', points: [[40, 15], [80, 15]], weight: 1.2 }, // Shoulder
        { type: 'curve', p1: [80, 15], p2: [30, 85], c1: [80, 60], weight: 1.2 } // Sweep
    ],
    'ケ': [
        { type: 'curve', p1: [35, 15], p2: [20, 65], c1: [30, 40], weight: 1.2 }, // Left Sweep
        { type: 'line', p1: [35, 28], p2: [85, 28], weight: 1.2 }, // Horz
        { type: 'curve', p1: [60, 28], p2: [45, 85], c1: [60, 60], weight: 1.2 } // Down Sweep
    ],
    'コ': [
        { type: 'path', points: [[25, 20], [75, 20], [75, 75]], weight: 1.2 }, // Top-Right
        { type: 'line', p1: [75, 75], p2: [25, 75], weight: 1.2 } // Bot
    ],

    // --- Sa Row ---
    'サ': [
        { type: 'line', p1: [20, 30], p2: [80, 30], weight: 1.2 }, // Horz
        { type: 'line', p1: [45, 20], p2: [40, 55], weight: 1.2 }, // Vert 1
        { type: 'line', p1: [65, 20], p2: [65, 45], weight: 1.2 }, // Vert 2 Top
        { type: 'curve', p1: [65, 45], p2: [45, 85], c1: [65, 70], weight: 1.2 } // Vert 2 Curve
    ],
    'シ': [
        { type: 'line', p1: [25, 25], p2: [35, 30], weight: 1.2 }, // Dot 1 (Horizontalish)
        { type: 'line', p1: [25, 45], p2: [35, 50], weight: 1.2 }, // Dot 2
        { type: 'curve', p1: [20, 85], p2: [85, 20], c1: [50, 85], weight: 1.2 } // Sweep Up
    ],
    'ス': [
        { type: 'path', points: [[20, 20], [80, 20]], weight: 1.2 }, // Top
        { type: 'line', p1: [80, 20], p2: [35, 85], weight: 1.2 }, // Main Diag
        { type: 'line', p1: [55, 45], p2: [85, 80], weight: 1.2 }  // Leg
    ],
    'セ': [
        { type: 'path', points: [[20, 30], [80, 30], [80, 50]], weight: 1.2 }, // Horz + Angle
        { type: 'curve', p1: [80, 50], p2: [55, 80], c1: [80, 70], weight: 1.2 }, // Hook in
        { type: 'path', points: [[50, 25], [50, 65], [80, 65]], weight: 1.2 }  // L Shape
    ],
    'ソ': [
        { type: 'line', p1: [30, 25], p2: [45, 35], weight: 1.2 }, // Dash
        { type: 'curve', p1: [75, 15], p2: [35, 85], c1: [70, 45], weight: 1.2 } // Sweep Down
    ],

    // --- Ta Row ---
    'タ': [
        { type: 'curve', p1: [35, 15], p2: [20, 40], c1: [30, 25], weight: 1.2 }, // Dash
        { type: 'path', points: [[25, 25], [75, 25], [75, 50]], weight: 1.2 }, // Shoulder
        { type: 'curve', p1: [75, 50], p2: [40, 85], c1: [75, 70], weight: 1.2 }, // Sweep
        { type: 'line', p1: [50, 45], p2: [70, 60], weight: 1.2 } // Tick
    ],
    'チ': [
        { type: 'curve', p1: [60, 10], p2: [35, 30], c1: [50, 20], weight: 1.2 }, // Top Dash
        { type: 'line', p1: [25, 35], p2: [80, 35], weight: 1.2 }, // Horz
        { type: 'path', points: [[52, 35], [52, 60]], weight: 1.2 }, // Vert Body
        { type: 'curve', p1: [52, 60], p2: [35, 85], c1: [50, 75], weight: 1.2 } // Curve
    ],
    'ツ': [
        { type: 'line', p1: [30, 25], p2: [40, 30], weight: 1.2 }, // Dot 1
        { type: 'line', p1: [50, 25], p2: [60, 30], weight: 1.2 }, // Dot 2
        { type: 'curve', p1: [80, 20], p2: [30, 85], c1: [70, 50], weight: 1.2 } // Sweep Down
    ],
    'テ': [
        { type: 'line', p1: [30, 25], p2: [75, 25], weight: 1.2 }, // Top
        { type: 'line', p1: [25, 45], p2: [80, 45], weight: 1.2 }, // Mid
        { type: 'curve', p1: [52, 45], p2: [35, 85], c1: [50, 70], weight: 1.2 } // Legs
    ],
    'ト': [
        { type: 'line', p1: [50, 15], p2: [50, 80], weight: 1.2 }, // Vert
        { type: 'line', p1: [50, 50], p2: [75, 70], weight: 1.2 }  // Pip
    ],

    // --- Na Row ---
    'ナ': [
        { type: 'line', p1: [25, 25], p2: [75, 25], weight: 1.2 }, // Horz
        { type: 'curve', p1: [40, 20], p2: [35, 80], c1: [40, 50], weight: 1.2 }, // Left Vert
    ],
    'ニ': [
        { type: 'line', p1: [30, 30], p2: [70, 30], weight: 1.2 }, // Top
        { type: 'line', p1: [20, 70], p2: [80, 70], weight: 1.2 } // Bot
    ],
    'ヌ': [
        { type: 'path', points: [[20, 20], [80, 20]], weight: 1.2 }, // Top
        { type: 'line', p1: [80, 20], p2: [30, 85], weight: 1.2 }, // Main Diag
        { type: 'line', p1: [45, 45], p2: [85, 75], weight: 1.2 }  // Crossing
    ],
    'ネ': [
        { type: 'line', p1: [45, 10], p2: [55, 20], weight: 1.2 }, // Top Pip
        { type: 'path', points: [[25, 28], [75, 28], [25, 75]], weight: 1.2 }, // Z Shape
        { type: 'line', p1: [50, 28], p2: [50, 80], weight: 1.2 }, // Vert
        { type: 'line', p1: [50, 55], p2: [80, 80], weight: 1.2 }  // Right Leg
    ],
    'ノ': [
        { type: 'curve', p1: [75, 20], p2: [25, 80], c1: [60, 50], weight: 1.2 }
    ],

    // --- Ha Row ---
    'ハ': [
        { type: 'curve', p1: [35, 25], p2: [20, 75], c1: [30, 50], weight: 1.2 },
        { type: 'curve', p1: [65, 25], p2: [80, 75], c1: [70, 50], weight: 1.2 }
    ],
    'ヒ': [
        { type: 'path', points: [[25, 30], [75, 30]], weight: 1.2 }, // Top
        { type: 'path', points: [[25, 30], [25, 75], [80, 70]], weight: 1.2 } // L Shape
    ],
    'フ': [
        { type: 'path', points: [[25, 20], [75, 20]], weight: 1.2 },
        { type: 'curve', p1: [75, 20], p2: [30, 80], c1: [55, 50], weight: 1.2 }
    ],
    'ヘ': [
        { type: 'path', points: [[20, 60], [50, 25], [80, 60]], weight: 1.2 }
    ],
    'ホ': [
        { type: 'line', p1: [25, 25], p2: [75, 25], weight: 1.2 }, // Horz
        { type: 'line', p1: [50, 15], p2: [50, 80], weight: 1.2 }, // Vert
        { type: 'line', p1: [30, 55], p2: [20, 75], weight: 1.2 }, // Left
        { type: 'line', p1: [70, 55], p2: [80, 75], weight: 1.2 }  // Right
    ],

    // --- Ma Row ---
    'マ': [
        { type: 'path', points: [[25, 20], [75, 20]], weight: 1.2 }, // Top
        { type: 'line', p1: [75, 20], p2: [35, 75], weight: 1.2 }, // Diag
        { type: 'line', p1: [55, 35], p2: [75, 50], weight: 1.2 }  // Tick
    ],
    'ミ': [
        { type: 'line', p1: [35, 25], p2: [65, 25], weight: 1.2 },
        { type: 'line', p1: [35, 45], p2: [65, 45], weight: 1.2 },
        { type: 'line', p1: [35, 65], p2: [65, 65], weight: 1.2 }
    ],
    'ム': [
        { type: 'path', points: [[30, 25], [70, 60], [90, 60]], weight: 1.2 }, // Angle
        { type: 'line', p1: [65, 40], p2: [75, 75], weight: 1.2 } // Dot
    ],
    'メ': [
        { type: 'curve', p1: [65, 15], p2: [25, 80], c1: [55, 45], weight: 1.2 }, // Left Sweep
        { type: 'curve', p1: [35, 35], p2: [80, 80], c1: [50, 50], weight: 1.2 }  // Right Sweep
    ],
    'モ': [
        { type: 'line', p1: [30, 30], p2: [70, 30], weight: 1.2 }, // Top
        { type: 'line', p1: [25, 50], p2: [75, 50], weight: 1.2 }, // Bot
        { type: 'path', points: [[50, 20], [50, 80], [75, 80]], weight: 1.2 } // Vert Hook
    ],

    // --- Ya Row ---
    'ヤ': [
        { type: 'path', points: [[25, 25], [75, 25], [65, 45]], weight: 1.2 }, // Top Angle
        { type: 'curve', p1: [65, 15], p2: [55, 85], c1: [60, 50], weight: 1.2 } // Vert Slant
    ],
    'ユ': [
        { type: 'path', points: [[25, 30], [75, 30], [75, 80]], weight: 1.2 }, // Frame
        { type: 'line', p1: [25, 60], p2: [75, 60], weight: 1.2 } // Mid
    ],
    'ヨ': [
        { type: 'path', points: [[75, 20], [25, 20], [25, 80], [75, 80]], weight: 1.2 }, // Frame
        { type: 'line', p1: [25, 50], p2: [75, 50], weight: 1.2 } // Mid
    ],

    // --- Ra Row ---
    'ラ': [
        { type: 'line', p1: [30, 20], p2: [70, 20], weight: 1.2 }, // Top
        { type: 'path', points: [[30, 40], [70, 40]], weight: 1.2 }, // Mid
        { type: 'curve', p1: [70, 40], p2: [35, 80], c1: [70, 70], weight: 1.2 } // Curve
    ],
    'リ': [
        { type: 'line', p1: [35, 20], p2: [35, 70], weight: 1.2 }, // Left
        { type: 'line', p1: [65, 20], p2: [65, 85], weight: 1.2 }  // Right
    ],
    'ル': [
        { type: 'curve', p1: [35, 25], p2: [25, 80], c1: [35, 50], weight: 1.2 }, // Left
        { type: 'path', points: [[60, 20], [60, 70], [80, 60]], weight: 1.2 } // Right Hook
    ],
    'レ': [
        { type: 'path', points: [[50, 15], [50, 70], [85, 60]], weight: 1.2 } // Hook
    ],
    'ロ': [
        { type: 'path', points: [[25, 20], [75, 20], [75, 80], [25, 80], [25, 20]], weight: 1.2 } // Box
    ],

    // --- Wa Row ---
    'ワ': [
        { type: 'line', p1: [40, 15], p2: [40, 65], weight: 1.2 }, // Vert
        { type: 'path', points: [[40, 15], [75, 15]], weight: 1.2 },
        { type: 'curve', p1: [75, 15], p2: [50, 80], c1: [75, 60], weight: 1.2 } // Roof Curve
    ],
    'ヲ': [
        { type: 'line', p1: [25, 25], p2: [75, 25], weight: 1.2 }, // Top
        { type: 'line', p1: [25, 50], p2: [75, 50], weight: 1.2 }, // Bot
        { type: 'path', points: [[35, 20], [35, 70], [75, 80]], weight: 1.2 } // Sweep
    ],
    'ン': [
        { type: 'line', p1: [30, 30], p2: [45, 40], weight: 1.2 }, // Dot
        { type: 'curve', p1: [30, 85], p2: [80, 20], c1: [50, 80], weight: 1.2 } // Up Sweep
    ]
};

// Helper: Get Vector with Fallback
export const getVector = (char) => {
    if (VECTOR_KATAKANA[char]) {
        return VECTOR_KATAKANA[char];
    }
    // Fallback: Box with Cross
    return [
        { type: 'line', p1: [10, 10], p2: [90, 10], weight: 1 },
        { type: 'line', p1: [90, 10], p2: [90, 90], weight: 1 },
        { type: 'line', p1: [90, 90], p2: [10, 90], weight: 1 },
        { type: 'line', p1: [10, 90], p2: [10, 10], weight: 1 },
        { type: 'line', p1: [10, 10], p2: [90, 90], weight: 0.8 },
        { type: 'line', p1: [90, 10], p2: [10, 90], weight: 0.8 }
    ];
};
