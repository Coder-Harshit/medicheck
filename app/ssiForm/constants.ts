export const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16-30', '31-60', '61-90'];

export const symptoms = [
  'purulentDischarge',
  'localizedPain',
  'localizedSwelling',
  'fever',
  'incisionOpened',
  'dehiscence',
  'abscess',
  'microorganismsSeen',
  'imagingEvidence',
  'positiveCulture',
  'bloodCultureSent',
  'diagnosisSSI',
  // 'anyOther'
];

export const SSIEvalChecklistItems = [
  "Administer antimicrobial prophylaxis in accordance with evidence-based standards.",
  "Administer antimicrobial prophylaxis within 1 hour prior to incision.",
  "Select antimicrobial prophylaxis agents on basis of surgical procedure.",
  "Select antimicrobial prophylaxis agents on basis of SSI pathogens.",
  "Select antimicrobial prophylaxis agents on published recommendations.",
  "Discontinue antibiotics within 24 hours after surgery end.",
  "Redose antibiotic at 3-hour interval in procedures > 3 hours.",
  "Adjust antimicrobial prophylaxis dose for obese patients (BMI>30).",
  "Not remove hair at operative site unless it interferes with operation.",
  "Use razors for hair removal at operative site.",
  "Use clippers or depilatory agent for hair removal.",
  "Use appropriate antiseptic agent for skin preparation.",
  "Mechanically prepare the colon (enemas, cathartic agents).",
  "Administer non-absorbable oral antimicrobial agents before operation.",
  "Keep OR doors closed during surgery except as needed.",
  "Maintain immediate post-op normothermia.",
];


export const antibioticOptions = [
  { value: "amoxicillin", label: "Amoxicillin" },
  { value: "ampicillin", label: "Ampicillin" },
  { value: "azithromycin", label: "Azithromycin" },
  { value: "cefazolin", label: "Cefazolin" },
  { value: "ceftriaxone", label: "Ceftriaxone" },
  { value: "ciprofloxacin", label: "Ciprofloxacin" },
  { value: "clindamycin", label: "Clindamycin" },
  { value: "doxycycline", label: "Doxycycline" },
  { value: "erythromycin", label: "Erythromycin" },
  { value: "gentamicin", label: "Gentamicin" },
  { value: "levofloxacin", label: "Levofloxacin" },
  { value: "metronidazole", label: "Metronidazole" },
  { value: "penicillin", label: "Penicillin" },
  { value: "tetracycline", label: "Tetracycline" },
  { value: "trimethoprim_sulfamethoxazole", label: "Trimethoprim-Sulfamethoxazole" },
  { value: "vancomycin", label: "Vancomycin" },
]

export const microorganisms = [
  "Staphylococcus aureus",
  "Escherichia coli",
  "Pseudomonas aeruginosa",
  "Klebsiella pneumoniae",
  "Enterococcus faecalis",
  "Proteus mirabilis",
  "Candida albicans",
  "Acinetobacter baumannii",
]
