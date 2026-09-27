// ─────────────────────────────────────────────────────────────
//  Project data. Every number here is copied from a report or
//  README inside the linked repository. If something isn't
//  published yet, it is marked as a placeholder — never guessed.
//
//  To add a project: append an object to `projects`, pick a
//  `visual` (or add a new one in src/visuals), and you're done.
// ─────────────────────────────────────────────────────────────

import { asset } from './profile';

export type VisualKey = 'pamac' | 'systolic' | 'ahb' | 'tof' | 'quad' | 'otto';

export interface Figure {
  src: string;
  alt: string;
  caption: string;
}

export interface Metric {
  label: string;
  value: string;
  note?: string;
}

export interface DetailSection {
  id: string;
  title: string;
  body?: string[];
  bullets?: string[];
  flow?: string[];
  code?: string;
  metrics?: Metric[];
  table?: { head: string[]; rows: string[][] };
  figures?: Figure[];
  placeholder?: string;
}

export interface Project {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  category: string[];
  description: string;
  tags: string[];
  repo: string | null;
  visual: VisualKey;
  cover?: Figure;
  story: { problem: string; architecture: string; implementation: string; verification: string; result: string };
  highlights: Metric[];
  highlightsNote?: string;
  sections: DetailSection[];
  featured?: boolean;
  domain: 'silicon' | 'systems';
}

const GH = 'https://github.com/gauravanand10/';
const UA = (id: string) => `https://github.com/user-attachments/assets/${id}`;

// ───────────────────────── 01 · PA-MAC ─────────────────────────
const pamac: Project = {
  slug: 'pa-mac',
  number: '01',
  title: 'PA-MAC',
  subtitle: 'Precision-Adaptive INT8/BF16 Dot-Product Engine',
  category: ['ASIC', 'VLSI', 'Hardware Accelerator', 'Low-Power Architecture'],
  description:
    'A precision-adaptive dot-product architecture exploring INT8 and BF16 computation through shared hardware, precision-aware datapaths and fine-grain power-domain concepts.',
  tags: ['SystemVerilog', 'RTL', 'INT8', 'BF16', 'UPF', 'Cadence Genus', 'Cadence Innovus', 'ASIC', 'Power Analysis'],
  repo: null, // ← set to GH + '<repo-name>' once the repository is public
  visual: 'pamac',
  featured: true,
  domain: 'silicon',
  story: {
    problem: 'ML inference mixes integer and floating-point precision. Separate engines for each waste area and leak power while idle.',
    architecture: 'One dot-product engine with INT8 and BF16 datapaths built around shared 8×8 multipliers, a DP4 reduction and a common accumulator.',
    implementation: 'SystemVerilog RTL with UPF-described power domains (PD_AON, PD_CORE, PD_FPU, PD_ACC), taken through Genus and Innovus.',
    verification: 'RTL simulation of both precision modes. Waveforms will be published with the repository.',
    result: 'Synthesis, timing, power and layout results will be added here once the reports are published.',
  },
  highlights: [
    { label: 'Precision modes', value: 'INT8 · BF16' },
    { label: 'PE operation', value: 'DP4' },
    { label: 'Power domains', value: '4', note: 'PD_AON · PD_CORE · PD_FPU · PD_ACC' },
    { label: 'Flow', value: 'Genus → Innovus' },
  ],
  highlightsNote: 'Area, timing and power numbers will be added from the Genus / Innovus reports.',
  sections: [
    {
      id: 'motivation',
      title: 'Motivation',
      body: [
        'Neural-network inference rarely runs at a single precision. Quantised layers want INT8 throughput; sensitive layers and training-adjacent work want the dynamic range of BF16.',
        'PA-MAC asks a hardware question: how much of a dot-product engine can the two precisions share, and how much of what they don’t share can be switched off?',
      ],
    },
    {
      id: 'problem',
      title: 'Problem',
      body: [
        'Building a separate INT8 MAC array and a separate BF16 FMA array duplicates multipliers, adders and accumulators. Whichever array is idle still costs area and leakage.',
      ],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      body: [
        'Operands enter a precision-select front end and are steered into either an INT8 datapath or a BF16 datapath. Both feed a shared accumulation stage.',
        'The enabling observation: a BF16 significand is 8 bits wide (7 stored bits plus the hidden bit), the same width as an INT8 operand. The 8×8 multiplier array at the heart of each processing element can therefore serve both precisions.',
      ],
      flow: ['Operands', 'Precision select', 'INT8 ⟂ BF16 datapath', 'DP4 reduction', 'Accumulator'],
    },
    {
      id: 'pe',
      title: 'Processing Elements',
      body: ['Each processing element (PE) is organised around three blocks:'],
      bullets: ['8×8 multipliers — the shared compute core', 'DP4 — a four-lane dot-product reduction', 'Accumulator — running sum across successive DP4 results'],
    },
    {
      id: 'int8',
      title: 'INT8 datapath',
      body: ['Signed 8-bit operands go straight into the 8×8 multipliers; the four products are reduced by the DP4 tree and added into the accumulator.'],
      placeholder: 'Datapath diagram and RTL excerpt will be added here.',
    },
    {
      id: 'bf16',
      title: 'BF16 datapath',
      body: ['BF16 operands are split into sign, 8-bit exponent and 7-bit mantissa. Significands (with the hidden bit) use the same 8×8 multipliers; exponent handling, alignment and normalisation sit in dedicated floating-point logic.'],
      placeholder: 'Datapath diagram and RTL excerpt will be added here.',
    },
    {
      id: 'dp4',
      title: 'DP4 operation',
      code: 'DP4(a, b) = a₀·b₀ + a₁·b₁ + a₂·b₂ + a₃·b₃\nacc ← acc + DP4(a, b)',
    },
    {
      id: 'precision',
      title: 'Precision handling',
      body: ['A precision-mode control selects which datapath is active for a given operation, so the unused path can be held idle or powered down rather than toggling.'],
      placeholder: 'Mode-switching details and rounding / overflow behaviour will be documented here.',
    },
    {
      id: 'power',
      title: 'Power-domain architecture',
      body: ['The design is partitioned into four power domains described in UPF, so logic that a given precision mode does not need can be switched off:'],
      table: {
        head: ['Domain', 'Role'],
        rows: [
          ['PD_AON', 'Always-on control'],
          ['PD_CORE', 'Core compute datapath'],
          ['PD_FPU', 'BF16 floating-point logic'],
          ['PD_ACC', 'Accumulation'],
        ],
      },
      placeholder: 'UPF excerpt, isolation / retention strategy and power-state table will be added here.',
    },
    { id: 'hierarchy', title: 'RTL hierarchy', placeholder: 'RTL module hierarchy will be added here.' },
    { id: 'simulation', title: 'Simulation', placeholder: 'Simulation waveforms for INT8 and BF16 modes will be added here.' },
    { id: 'synthesis', title: 'Synthesis', placeholder: 'Cadence Genus synthesis results will be added here.' },
    { id: 'timing', title: 'Timing', placeholder: 'Timing reports will be added here.' },
    { id: 'power-results', title: 'Power', placeholder: 'Power analysis per mode and per domain will be added here.' },
    { id: 'pnr', title: 'Physical implementation', placeholder: 'Cadence Innovus floorplan, placement and routed-layout screenshots will be added here.' },
    { id: 'results', title: 'Results', placeholder: 'Project results will be added here.' },
  ],
};

// ─────────────────── 02 · Sobel systolic accelerator ───────────────────
const sobel: Project = {
  slug: 'sobel-systolic-accelerator',
  number: '02',
  title: 'Systolic Array Accelerator',
  subtitle: 'Real-Time Sobel Edge Detection',
  category: ['RTL', 'Hardware Accelerator', 'Digital Design', 'FPGA / ASIC'],
  description:
    'A streaming Sobel edge-detection accelerator built from 3×3 systolic arrays of multiply-accumulate processing elements — taken through Genus synthesis, formal equivalence, scan insertion and ATPG, and deployed on a Zybo-7000 FPGA.',
  tags: ['Verilog', 'SystemVerilog', 'Systolic Array', 'Sobel', 'VCS', 'Verdi', 'Cadence Genus', 'Conformal LEC', 'Modus ATPG', 'RISC-V Spike', 'Vivado', 'Zybo-7000', 'MATLAB'],
  repo: GH + 'SOBEL-EDGE-DETECTION-SYSTOLIC-ACCELERATOR',
  visual: 'systolic',
  domain: 'silicon',
  cover: { src: UA('3b874f49-871a-481d-95fb-7d3743510c08'), alt: 'Top-level hardware architecture of the Sobel accelerator', caption: 'Top-level architecture' },
  story: {
    problem: 'Edge detection is a per-pixel 3×3 convolution — cheap to describe, expensive to run in software at video rates.',
    architecture: 'A window generator feeds parallel Gx and Gy 3×3 systolic arrays; |Gx| + |Gy| is written into a result buffer under an FSM controller.',
    implementation: 'Synthesizable Verilog RTL, synthesized with Cadence Genus on the TSL18FS120 180 nm library at 10 ns.',
    verification: 'Module testbenches in VCS/Verdi, a Python → C → RV32IM golden model on Spike, Conformal LEC, scan DFT and Modus ATPG.',
    result: 'Timing met with 6.522 ns slack, 7.02 mW, 99.94 % test coverage — and running on a Zybo-7000 on a 640×480 image.',
  },
  highlights: [
    { label: 'Worst slack @ 10 ns', value: '+6.522 ns', note: 'Genus, 0 violating paths' },
    { label: 'Total power', value: '7.02 mW', note: 'Genus power.rpt' },
    { label: 'Test coverage', value: '99.94 %', note: 'Modus ATPG · 23 patterns' },
    { label: 'Scan flops', value: '262', note: '1 muxed-scan chain' },
  ],
  sections: [
    {
      id: 'problem',
      title: 'Problem',
      body: [
        'Edge detection underpins computer vision, embedded vision, medical imaging and surveillance. Every output pixel needs two 3×3 convolutions — a natural fit for a spatial, pipelined hardware array rather than a sequential CPU loop.',
      ],
    },
    {
      id: 'algorithm',
      title: 'Sobel algorithm',
      body: ['Horizontal and vertical gradients are computed in parallel and combined with a hardware-friendly magnitude approximation:'],
      code: 'Gx = [-1 0 +1; -2 0 +2; -1 0 +1] ⊛ W\nGy = [-1 -2 -1;  0 0  0; +1 +2 +1] ⊛ W\nEdge = |Gx| + |Gy|',
    },
    {
      id: 'architecture',
      title: 'Hardware architecture',
      flow: ['Image', 'Window generator', 'Gx ∥ Gy systolic arrays', '|Gx| + |Gy|', 'Result buffer'],
      figures: [
        { src: UA('5eeab983-34d9-4089-8ef3-607b51b166a7'), alt: 'Complete data flow of the Sobel accelerator', caption: 'Fig. 1 — Complete data flow' },
        { src: UA('3b874f49-871a-481d-95fb-7d3743510c08'), alt: 'Top-level hardware architecture', caption: 'Fig. 2 — Top-level hardware architecture' },
      ],
    },
    {
      id: 'window',
      title: 'Window generator',
      body: ['Converts the incoming pixel stream into overlapping 3×3 windows that are presented to both gradient arrays at once.'],
    },
    {
      id: 'pe',
      title: 'Processing elements',
      body: ['Each parameterised PE holds a pixel register, a weight register, an 8×8 multiplier and a 32-bit accumulator.'],
      code: 'acc_out = acc_in + (pixel × weight)',
      figures: [{ src: UA('201c2e4e-fd9c-4578-81e0-b0825b2ec7fb'), alt: 'Internal architecture of the processing element', caption: 'Fig. 3 — Processing element' }],
    },
    {
      id: 'dataflow',
      title: 'Systolic dataflow & control',
      body: [
        'Partial sums ripple through the 3×3 PE grid so each PE only talks to its neighbour — short wires, regular layout. An FSM controller sequences the pipeline, generates window IDs and memory write addresses, and raises completion.',
      ],
      figures: [
        { src: UA('189f6e1c-208e-4181-b5a2-971b02c2a33c'), alt: 'Controller finite state machine', caption: 'Fig. 4 — Controller FSM' },
        { src: UA('199475ae-0cb7-4082-b2ca-b737fc68ac57'), alt: 'Result buffer', caption: 'Fig. 5 — Result buffer' },
      ],
    },
    {
      id: 'rtl',
      title: 'RTL modules',
      table: {
        head: ['Module', 'Role'],
        rows: [
          ['WINDOW_GENERATOR', 'Overlapping 3×3 windows from the input image'],
          ['SOBEL_PE', 'Multiply-accumulate processing element'],
          ['SOBEL_GX_ARRAY', 'Horizontal-gradient systolic array'],
          ['SOBEL_GY_ARRAY', 'Vertical-gradient systolic array'],
          ['RESULT_BUFFER', 'Stores computed edge magnitudes'],
          ['SOBEL_CONTROLLER', 'FSM sequencing the accelerator'],
          ['SOBEL_EDGE_TOP', 'Top-level integration'],
        ],
      },
    },
    {
      id: 'verification',
      title: 'Verification',
      body: [
        'Every module has its own testbench, simulated in Synopsys VCS and debugged in Verdi. Expected results come from a golden model: a Python reference, re-implemented in C, cross-compiled to a bare-metal RV32IM ELF and executed on the Spike RISC-V ISA simulator.',
      ],
      flow: ['Python golden model', 'C implementation', 'RV32IM bare-metal ELF', 'Spike ISA sim', 'Register check'],
      figures: [
        { src: asset('images/spike_verification.webp'), alt: 'Spike RISC-V simulator output used to verify the golden model', caption: 'Golden model verified on Spike (RV32IM)' },
        { src: UA('ef0d9f48-d141-4001-963a-526b367ff8bc'), alt: 'Top-level simulation waveform', caption: 'Top-level simulation' },
      ],
    },
    {
      id: 'synthesis',
      title: 'Synthesis — Cadence Genus 20.11',
      body: ['Target: TSL18FS120 standard-cell library (180 nm), nominal corner, clk period 10 ns (100 MHz).'],
      metrics: [
        { label: 'Worst slack', value: '6.522 ns' },
        { label: 'Critical path', value: '3.228 ns' },
        { label: 'TNS / violating paths', value: '0 / 0' },
        { label: 'Cell area', value: '32,376.064' },
        { label: 'Net area', value: '11,951.824' },
        { label: 'Total area', value: '44,327.888' },
        { label: 'Std-cell instances', value: '681', note: '262 sequential · 419 combinational' },
        { label: 'Total power', value: '7.024 mW', note: 'internal 5.739 · switching 1.285 · leakage ≈ 48 nW' },
      ],
      figures: [
        { src: UA('ba825561-17d3-41d6-9922-daba9aafa1b3'), alt: 'Genus synthesis result', caption: 'Genus synthesis' },
        { src: UA('e079d5ec-8b3a-42f1-9119-eeed9c61fdb0'), alt: 'Genus schematic after technology mapping', caption: 'Post-mapping schematic' },
      ],
    },
    {
      id: 'lec',
      title: 'Formal equivalence — Cadence Conformal',
      body: ['The Genus gate-level netlist was checked against the RTL with Conformal LEC: parsing, mapping, sequential mapping, datapath analysis and logic comparison all pass.'],
      figures: [{ src: UA('edbdc126-5b41-4848-9cc9-c8cdaff94c4e'), alt: 'Conformal LEC result', caption: 'Conformal LEC' }],
    },
    {
      id: 'dft',
      title: 'DFT & ATPG — Genus DFT + Cadence Modus',
      body: ['Muxed-scan insertion stitches all 262 flops into one chain (DFT_sdi_1 → DFT_sdo_1, scan_en active-high). Modus then generates stuck-at patterns on the scan netlist.'],
      metrics: [
        { label: 'Total faults', value: '7,992' },
        { label: 'Tested', value: '7,987' },
        { label: 'Redundant', value: '5' },
        { label: 'Test coverage', value: '99.94 %' },
        { label: 'ATPG coverage', value: '100.00 %' },
        { label: 'Patterns', value: '23', note: '1 scan + 22 logic' },
      ],
      figures: [
        { src: UA('af1916ad-6851-409f-8f73-bbca373181f1'), alt: 'DFT scan insertion', caption: 'Scan insertion' },
        { src: UA('bebc26de-7d49-45f5-93cd-e37940d17243'), alt: 'Cadence Modus ATPG summary', caption: 'Modus ATPG summary' },
      ],
    },
    {
      id: 'fpga',
      title: 'FPGA implementation',
      body: ['The accelerator was deployed on a Zybo-7000 board (Xilinx Vivado) and run on a 640×480 grayscale image; the output edge map was reconstructed in MATLAB.'],
      flow: ['640×480 grayscale', 'Zybo-7000 · Vivado', 'Sobel accelerator', 'Edge output', 'MATLAB reconstruction'],
      placeholder: 'FPGA utilisation report and output images will be added here.',
    },
  ],
};

// ─────────────────────────── 03 · AMBA-AHB ───────────────────────────
const ahb: Project = {
  slug: 'amba-ahb',
  number: '03',
  title: 'AMBA-AHB',
  subtitle: 'Protocol Controller Design & Verification',
  category: ['RTL', 'SoC Interconnect', 'Verification', 'ASIC'],
  description:
    'An AMBA-AHB bus subsystem — master, slave, address decoder and read-data multiplexer — with FSM-driven single and burst transfers, verified in VCS/Verdi, linted in SpyGlass and synthesized with Design Compiler.',
  tags: ['Verilog', 'AMBA', 'AHB', 'RTL', 'FSM', 'VCS', 'Verdi', 'SpyGlass', 'Design Compiler'],
  repo: GH + 'AMBA-AHB-Protocol-Controller-Design-Verification',
  visual: 'ahb',
  domain: 'silicon',
  cover: { src: UA('c08ac9a3-08fd-4e09-88da-9323b92c7f8f'), alt: 'AHB simulation in Verdi', caption: 'Verdi waveform' },
  story: {
    problem: 'SoCs need a pipelined, high-bandwidth path between processor, memory and peripherals — and the protocol has to be exactly right.',
    architecture: 'Master FSM → shared AHB bus → address decoder selects a slave → read-data mux returns HRDATA / HREADY / HRESP.',
    implementation: 'Parameterised Verilog: single read/write, INCR4 and WRAP4 bursts, wait states and back-to-back transfers.',
    verification: 'Directed testbenches per module and at top level in VCS, waveform debug in Verdi, RTL lint in SpyGlass.',
    result: '100 MHz timing closure with zero setup / hold violations; SRAM macros cut cells from 95K to ~7K and power from 172 mW to 30–40 mW.',
  },
  highlights: [
    { label: 'Timing closure', value: '100 MHz', note: 'Design Compiler' },
    { label: 'Std cells', value: '95K → ~7K', note: '4 × 256×32 SRAM macros' },
    { label: 'Violating paths', value: '0', note: 'setup and hold' },
    { label: 'Power (with SRAM macros)', value: '172 → 30–40 mW' },
  ],
  sections: [
    {
      id: 'architecture',
      title: 'AHB architecture',
      body: ['The AMBA Advanced High-performance Bus is ARM’s pipelined on-chip bus for connecting processors, memories and fast peripherals. Every transfer has an address phase and a data phase that overlap with the next transfer.'],
      figures: [
        { src: UA('1685925f-1a78-44ec-ba9b-6677ae6c73b2'), alt: 'AHB architecture block diagram', caption: 'Architecture' },
        { src: UA('6c66923e-94f1-47e5-ba86-ce5db7d9f27b'), alt: 'AHB interconnect diagram', caption: 'Interconnect' },
      ],
    },
    {
      id: 'modules',
      title: 'Modules',
      table: {
        head: ['Block', 'Responsibility'],
        rows: [
          ['AHB Master', 'Generates transactions, drives address/data phases, protocol FSM for single & burst'],
          ['AHB Slave', 'Services reads/writes, generates HREADYOUT and HRESP'],
          ['Address Decoder', 'Decodes HADDR and asserts the slave select'],
          ['Slave Multiplexer', 'Returns the selected slave’s HRDATA, HREADY and HRESP'],
        ],
      },
    },
    {
      id: 'fsm',
      title: 'Master FSM',
      body: ['The master sequences IDLE → address → data phases and a dedicated BURST state that walks the burst address: +4 per beat for INCR4, and wrapping at the 16-byte boundary for WRAP4.'],
      code: '// WRAP4 address generation (ahb_master.v)\nwrap_base = addr_reg & 32\'hFFFF_FFF0;\nif ((burst_addr + 4) >= (wrap_base + 16))\n  burst_addr <= wrap_base;\nelse\n  burst_addr <= burst_addr + 4;',
      figures: [{ src: UA('19ff7097-67bb-4155-8ec0-049cc2efcb30'), alt: 'AHB master finite state machine', caption: 'Master FSM' }],
    },
    {
      id: 'transfers',
      title: 'Transfers',
      bullets: ['Single write / single read', 'INCR4 incrementing burst', 'WRAP4 wrapping burst', 'Wait-state insertion via HREADY', 'Back-to-back transfers'],
    },
    {
      id: 'verification',
      title: 'Testbench & verification',
      body: ['Each block has a directed Verilog testbench; the full subsystem is exercised from tb_ahb_top. Simulation runs in Synopsys VCS and waveforms are inspected in Verdi.'],
      figures: [
        { src: UA('25bcf2af-e7e9-449d-9884-32ebfdebccef'), alt: 'AHB master simulation waveform', caption: 'Master — VCS / Verdi' },
        { src: UA('6da8d6f5-5ec3-4305-b323-1aef54b363d5'), alt: 'AHB top-level simulation', caption: 'Top level — VCS / Verdi' },
      ],
    },
    {
      id: 'spyglass',
      title: 'SpyGlass lint',
      body: ['RTL checked with Synopsys SpyGlass (lint, clock-reset, ERC, latch, STARC). The full message list — including the remaining black-box and bit-width errors being worked through — is published in the repository.'],
      figures: [{ src: UA('ca3d3188-cd98-42a3-af2e-32b3b7271a33'), alt: 'SpyGlass elaborated hierarchy', caption: 'SpyGlass — design hierarchy' }],
    },
    {
      id: 'synthesis',
      title: 'Synthesis & timing — Design Compiler',
      body: ['Synthesized with Synopsys Design Compiler on the TSL18FS120 180 nm library (slow-slow corner).'],
      metrics: [
        { label: 'Clock period', value: '10.00 ns' },
        { label: 'Critical path length', value: '9.00 ns' },
        { label: 'Setup WNS / TNS', value: '0.00 / 0.00' },
        { label: 'Hold WNS / TNS', value: '0.00 / 0.00' },
        { label: 'Violating paths', value: '0' },
      ],
      figures: [{ src: UA('f7feff9b-c45c-44fd-9277-d5f750a8f37d'), alt: 'Design Compiler synthesis result', caption: 'Design Compiler' }],
    },
    {
      id: 'sram',
      title: 'SRAM macro integration',
      body: ['The first synthesis built the slave memory out of standard cells. Replacing it with 4 × 256×32 SRAM macros cut the design down sharply:'],
      metrics: [
        { label: 'Std-cell count', value: '95K → ~7K' },
        { label: 'Power', value: '172 mW → 30–40 mW' },
        { label: 'SRAM macros', value: '4 × 256×32' },
        { label: 'Timing', value: '100 MHz', note: 'zero setup / hold violations' },
      ],
    },
    {
      id: 'next',
      title: 'Next steps',
      bullets: ['Multi-master bus matrix', 'SPLIT / RETRY responses', 'UVM testbench with functional coverage', 'Assertion-based verification', 'Gate-level simulation'],
    },
  ],
};

// ─────────────────────── 04 · ESP32-CAM + ToF ───────────────────────
const tof: Project = {
  slug: 'esp32-cam-tof',
  number: '04',
  title: 'Camera + 8×8 ToF',
  subtitle: 'ESP32-CAM + VL53L5CX Perception System',
  category: ['Embedded Systems', 'Perception', 'Sensor Fusion'],
  description:
    'A two-board perception system: an ESP32-CAM streams RGB video over HTTP while an ESP32 reads a VL53L5CX 8×8 time-of-flight sensor over I²C and serves live depth frames as JSON.',
  tags: ['ESP32-CAM', 'OV2640', 'ESP32', 'VL53L5CX', 'I²C', 'Wi-Fi', 'HTTP', 'ToF', 'C/C++'],
  repo: GH + 'ESP32-CAM-ToF-Depth-Estimation',
  visual: 'tof',
  domain: 'systems',
  story: {
    problem: 'A camera sees texture but not distance; a single-point rangefinder sees distance but not the scene.',
    architecture: 'ESP32-CAM (OV2640) → HTTP MJPEG stream. ESP32 + VL53L5CX → 64-zone depth frame → HTTP JSON. A laptop consumes both.',
    implementation: 'Camera web server on the AI-Thinker ESP32-CAM; I²C ToF driver, frame buffering and an HTTP endpoint on the ESP32.',
    verification: 'Live camera stream and live 8×8 depth map observed in the browser.',
    result: 'Both sensor streams working independently; laptop-side fusion is in progress.',
  },
  highlights: [
    { label: 'Depth zones', value: '8 × 8', note: '64 per frame' },
    { label: 'Transport', value: 'Wi-Fi / HTTP' },
    { label: 'Sensor bus', value: 'I²C' },
    { label: 'Boards', value: '2 × ESP32' },
  ],
  sections: [
    {
      id: 'hardware',
      title: 'Hardware',
      table: {
        head: ['Subsystem', 'Hardware', 'Role'],
        rows: [
          ['Camera', 'AI-Thinker ESP32-CAM + OV2640', 'Captures frames, serves stream over HTTP'],
          ['Depth', 'ESP32-WROOM + VL53L5CX', 'Multi-zone ranging, serves depth frames over HTTP'],
          ['Programming', 'FTDI USB-UART', 'Flashing and boot / debug logs for the ESP32-CAM'],
        ],
      },
    },
    {
      id: 'tof',
      title: '8×8 depth sensing',
      body: ['The VL53L5CX returns a grid of distances instead of a single value. In the demonstrated configuration each frame has 8 × 8 = 64 zones, each one a different spatial region in front of the sensor.'],
    },
    {
      id: 'firmware',
      title: 'ToF firmware',
      bullets: [
        'Initialise the VL53L5CX over I²C and configure ranging',
        'Poll for new measurements and read ranging data',
        'Maintain the latest depth frame with a sequence counter',
        'Serve distance + per-zone status as JSON over HTTP',
        'Browser-based live depth-map view',
      ],
    },
    {
      id: 'camera',
      title: 'Camera streaming',
      body: ['The ESP32-CAM runs an HTTP camera server; the live stream was verified in a browser at the board’s :81/stream endpoint.'],
    },
    {
      id: 'system',
      title: 'System',
      flow: ['ESP32-CAM → RGB stream', 'ESP32 + VL53L5CX → 8×8 depth', 'Wi-Fi / HTTP', 'Laptop: visualisation & fusion'],
      body: ['The ESP32s handle sensor-side acquisition; the laptop is used for visualisation and fusion.'],
    },
    { id: 'fusion', title: 'Combined visualisation', placeholder: 'Camera + depth fusion (Python / OpenCV) is in progress. Screenshots and hardware photographs will be added here.' },
  ],
};

// ─────────────────────── 05 · Quadcopter ───────────────────────
const quad: Project = {
  slug: 'esp32-quadcopter',
  number: '05',
  title: 'ESP32 Quadcopter',
  subtitle: 'Flight Controller',
  category: ['Embedded Systems', 'Flight Control', 'Robotics'],
  description:
    'A custom ESP32 flight controller: FlySky receiver input, MPU6050 attitude estimation with a complementary filter, cascaded angle + rate PID and four-channel ESC output at 500 Hz.',
  tags: ['ESP32', 'C++', 'MPU6050', 'BMP280', 'PID', 'Complementary Filter', 'ESC', 'BLDC', 'FlySky'],
  repo: GH + 'ESP32-Quadcopter-Flight-Controller',
  visual: 'quad',
  domain: 'systems',
  cover: { src: asset('images/quadcopter.webp'), alt: 'The ESP32 quadcopter hardware', caption: 'The build' },
  story: {
    problem: 'A quadcopter is unstable by nature — it only stays level if a controller corrects it hundreds of times a second.',
    architecture: 'RC receiver → ESP32 (estimation + cascaded PID + motor mixing) → 4 ESCs → 4 BLDC motors, with MPU6050 on I²C.',
    implementation: 'Arduino-framework C++ on ESP32: 6-channel PWM capture, complementary filter, angle / rate / yaw-rate PIDs, 500 Hz ESC PWM.',
    verification: 'LED-indicated calibration, throttle limiting and motor cutoff below arming throttle.',
    result: 'Working flight-controller firmware and hardware; documentation for control, PID and calibration in the repo.',
  },
  highlights: [
    { label: 'ESC update', value: '500 Hz' },
    { label: 'ESC pulse', value: '1000–2000 µs' },
    { label: 'RC channels', value: '6', note: 'FlySky FS-i6X' },
    { label: 'Control', value: 'Angle → Rate PID' },
  ],
  sections: [
    {
      id: 'hardware',
      title: 'Hardware',
      table: {
        head: ['Component', 'Purpose'],
        rows: [
          ['ESP32', 'Flight controller'],
          ['MPU6050', '6-axis IMU — 3-axis accelerometer + 3-axis gyroscope (I²C)'],
          ['BMP280', 'Barometer for height measurement / future altitude hold'],
          ['FlySky FS-i6X + receiver', 'Pilot input, 6 PWM channels'],
          ['4 × ESC + 4 × BLDC', 'Propulsion'],
          ['XT60 + PDB', 'Battery input and ESC power distribution'],
          ['Buck converter', 'Regulated 3.3 V for the ESP32'],
        ],
      },
      figures: [{ src: asset('images/quadcopter.webp'), alt: 'Quadcopter hardware photograph', caption: 'Quadcopter hardware' }],
    },
    {
      id: 'architecture',
      title: 'Flight-controller architecture',
      flow: ['RC input', 'Complementary filter', 'Angle PID', 'Rate PID', 'Motor mixing', 'ESC ×4', 'BLDC ×4'],
      body: ['Roll and pitch are estimated by fusing gyro integration with the accelerometer’s gravity vector. The outer angle loop produces a desired angular rate; the inner rate loop — plus a dedicated yaw-rate PID — produces the corrections that are mixed onto the four motors.'],
    },
    {
      id: 'safety',
      title: 'Safety behaviour',
      bullets: ['Motors not armed while throttle channel is below ~1030 µs', 'Throttle limiting', 'Motor cutoff', 'LED-based startup / calibration indication'],
    },
    { id: 'testing', title: 'Testing', placeholder: 'Flight-test logs and videos will be added here.' },
  ],
};

// ─────────────────────── 06 · OTTO robot ───────────────────────
const otto: Project = {
  slug: 'esp32-otto-robot',
  number: '06',
  title: 'ESP32 OTTO Robot',
  subtitle: 'Wireless Otto Ninja Platform',
  category: ['Embedded Systems', 'Robotics', 'ESP32', 'C++'],
  description:
    'A 3D-printed Otto Ninja robot driven by two ESP32s: a joystick transmitter sends commands over Wi-Fi / UDP to a receiver that runs differential servo drive with ultrasonic obstacle stop.',
  tags: ['ESP32', 'C++', 'Wi-Fi', 'UDP', 'Servo', 'HC-SR04', '3D Printing', 'Robotics'],
  repo: GH + 'ESP32-OTTO-ROBOT',
  visual: 'otto',
  domain: 'systems',
  cover: { src: asset('images/otto-robot.webp'), alt: 'The ESP32 Otto Ninja robot', caption: 'The robot' },
  story: {
    problem: 'Build a small, wireless, safe-to-drive robot with a clean split between controller and robot.',
    architecture: 'ESP32 transmitter (joystick → direction) → Wi-Fi / UDP :4210 → ESP32 receiver → two continuous-rotation servos.',
    implementation: 'Transmitter runs a soft AP and sends DIR:… packets; receiver parses DIR and drives servos differentially.',
    verification: 'Calibrated joystick centre with dead-zone; HC-SR04 stops the robot inside a safety threshold.',
    result: 'Working joystick-controlled robot with forward, reverse, turns, stop and obstacle protection.',
  },
  highlights: [
    { label: 'Link', value: 'Wi-Fi / UDP', note: 'port 4210' },
    { label: 'Drive', value: 'Differential servo' },
    { label: 'Safety', value: 'HC-SR04 stop' },
    { label: 'Controllers', value: '2 × ESP32' },
  ],
  sections: [
    {
      id: 'architecture',
      title: 'Robot architecture',
      flow: ['Analog joystick', 'ESP32 transmitter', 'Wi-Fi / UDP :4210', 'ESP32 receiver', 'L / R servo', 'Otto Ninja'],
    },
    {
      id: 'control',
      title: 'Control mapping',
      table: { head: ['Joystick', 'Action'], rows: [['Up', 'Forward'], ['Down', 'Backward'], ['Left', 'Turn left'], ['Right', 'Turn right'], ['Centre', 'Stop']] },
      code: '// example packet\nDIR:FORWARD,X:2500,Y:1200,BTN:1\n\n// calibration\nCenter X : 3010\nCenter Y : 2840\nDead zone: 200',
    },
    {
      id: 'hardware',
      title: 'Hardware',
      bullets: ['2 × ESP32 development boards', 'Analog joystick (VRx / VRy / SW)', '2 × continuous-rotation servos (GPIO 13 / 12)', 'HC-SR04 ultrasonic sensor', '3D-printed Otto Ninja body (STL files in repo)'],
      figures: [
        { src: asset('images/otto-robot.webp'), alt: 'Otto Ninja robot photograph', caption: 'Receiver — the robot' },
        { src: asset('images/transmitter.webp'), alt: 'Joystick transmitter photograph', caption: 'Transmitter — joystick + ESP32' },
      ],
    },
    { id: 'scope', title: 'Scope', body: ['Current implementation is analog-joystick control only. EEG / EMG-based control is not part of the current hardware or firmware.'] },
    { id: 'demo', title: 'Demonstration', placeholder: 'Demo video will be added here.' },
  ],
};

export const projects: Project[] = [pamac, sobel, ahb, tof, quad, otto];
export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
