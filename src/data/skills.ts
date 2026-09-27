export const skillGroups = [
  {
    id: 'rtl',
    title: 'RTL / Digital Design',
    code: 'RTL',
    items: ['Verilog', 'SystemVerilog', 'RTL Architecture', 'FSM Design', 'Pipelining', 'Systolic Arrays', 'AMBA-AHB', 'AXI', 'UART', 'JTAG'],
  },
  {
    id: 'asic',
    title: 'ASIC',
    code: 'ASIC',
    items: ['Cadence Genus', 'Cadence Innovus', 'Cadence Modus', 'Cadence Conformal', 'Cadence Voltus', 'Cadence Xcelium', 'Synopsys VCS', 'Verdi', 'SpyGlass', 'Design Compiler', 'STA', 'DFT / ATPG', 'Physical Design', 'Power Analysis', 'TCL'],
  },
  {
    id: 'fpga',
    title: 'FPGA',
    code: 'FPGA',
    items: ['Vivado', 'Vitis', 'Zynq', 'Zybo-7000', 'PYNQ', 'FPGA Architecture'],
  },
  {
    id: 'embedded',
    title: 'Embedded',
    code: 'EMB',
    items: ['ESP32', 'C / C++', 'Python', 'MATLAB', 'OpenCV', 'UART', 'SPI', 'I²C', 'MPU6050', 'VL53L5CX'],
  },
  {
    id: 'arch',
    title: 'Architecture & Simulation',
    code: 'ARCH',
    items: ['RISC-V (RV32I)', 'Gem5', 'RISC-V GNU Toolchain', 'Spike', 'Cache hierarchy', 'Performance modelling'],
  },
  {
    id: 'hardware',
    title: 'Hardware',
    code: 'HW',
    items: ['BLDC', 'ESC', 'Motor Control', 'Servo Drive', 'Sensors', 'Robotics', '3D Printing'],
  },
];

export const researchTopics = [
  { t: 'Precision-adaptive computing', d: 'Sharing one datapath across numeric formats instead of duplicating engines.' },
  { t: 'INT8 / BF16 arithmetic', d: 'Integer throughput vs. floating-point dynamic range in inference hardware.' },
  { t: 'Low-power hardware', d: 'Power domains, UPF, gating the logic a mode doesn’t need.' },
  { t: 'Neural accelerators', d: 'Dot-product engines, MAC arrays and dataflow for ML workloads.' },
  { t: 'Systolic arrays', d: 'Neighbour-only dataflow for regular, scalable compute fabrics.' },
  { t: 'RISC-V', d: 'RV32I 5-stage core and Gem5 performance modelling (in progress); Spike for golden models.' },
  { t: 'ASIC design', d: 'Synthesis, equivalence, DFT, ATPG and physical implementation.' },
  { t: 'FPGA acceleration', d: 'Mapping accelerators onto programmable fabric and Zynq SoCs.' },
  { t: 'Digital architecture', d: 'Bus protocols, memory organisation and datapath design.' },
];
