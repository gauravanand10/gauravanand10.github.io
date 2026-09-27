// ─────────────────────────────────────────────────────────────
//  Personal details. Edit here — every section reads from this.
// ─────────────────────────────────────────────────────────────

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const profile = {
  name: 'Gaurav Anand',
  firstName: 'Gaurav',
  primaryIdentity: ['VLSI', 'ASIC', 'FPGA', 'Digital Hardware', 'Embedded Systems'],
  secondaryIdentity: ['RTL', 'RISC-V', 'Hardware Acceleration', 'Verification'],
  education: {
    degree: 'B.Tech — VLSI Design',
    school: 'Thapar Institute of Engineering & Technology, Patiala',
    period: 'Aug 2023 – Present',
    cgpa: '8.17 / 10',
    coursework: ['Digital System Design', 'Embedded Systems', 'Computer Architecture', 'CMOS VLSI Design'],
  },
  internship: {
    org: 'Patiala Locomotive Works',
    role: 'Vocational Trainee',
    period: 'Jun 2025 – Jul 2025',
    note: 'Tested integrated circuits using the Advance Diagnostic Tester.',
  },
  now: {
    title: 'RV32I Processor Performance Modelling',
    period: 'Jul 2026 – Present',
    note: 'Building a 5-stage RV32I core and modelling its microarchitecture in Gem5: IPC / CPI, cache hierarchy and memory-system behaviour across RISC-V workloads.',
  },
  org: { name: 'VLSI-INTEGRATION', url: 'https://github.com/VLSI-INTEGRATION' },
  links: {
    github: 'https://github.com/gauravanand10',
    linkedin: 'https://www.linkedin.com/in/gaurav-anand-5280b8288/',
    email: 'mailto:gauravanand2506@gmail.com',
    emailPlain: 'gauravanand2506@gmail.com',
  },
  resume: {
    // Drop your PDF at public/resume/Gaurav_Anand_Resume.pdf and flip `available` to true.
    available: true,
    path: 'resume/Gaurav_Anand_Resume.pdf',
    fileName: 'Gaurav_Anand_Resume.pdf',
  },
};

export const techMarquee = [
  'Verilog', 'SystemVerilog', 'RTL', 'ASIC', 'FPGA', 'RISC-V', 'AMBA', 'AHB',
  'Systolic Arrays', 'INT8', 'BF16', 'Genus', 'Innovus', 'Conformal', 'Modus',
  'VCS', 'Verdi', 'Xcelium', 'SpyGlass', 'Gem5', 'Vivado', 'Vitis', 'TCL', 'ESP32', 'C++', 'Python', 'OpenCV',
];

// Other real, public repositories (shown in the GitHub section).
export const moreRepos = [
  { name: '50_Days_of_RTL', lang: 'Verilog', note: '50-day RTL challenge — one Verilog design verified daily' },
  { name: 'Low-Power-Banked-Memory-Architecture', lang: 'Verilog', note: 'Bank-gated memory for lower dynamic power · Genus / DC' },
  { name: '10_Days_of_TCL', lang: 'Tcl', note: 'TCL for EDA scripting' },
  { name: 'HAND-GESTURE-CONTROLLED-BUGGY', lang: 'C++', note: 'Gesture-controlled robot buggy' },
];
