/**
 * nicheRegistry.js
 * Centralized registry for all V7.0 Ultra-Niche and Specialized Domain Engines.
 * Connects domain names, display labels, search keywords, specialized personas/roles, and focus topics.
 */

const nicheRegistry = {
  nutrition_fitness: {
    label: "Nutrition & Fitness Intelligence",
    role: "Nutrition & Fitness Specialist",
    keywords: ["nutrition", "diet", "calorie", "protein", "carbs", "fat", "keto", "vegan", "intermittent fasting", "workout", "fitness", "hiit", "weight loss", "muscle gain", "creatine", "supplement", "hydration", "sleep optimization"],
    topics: [
      "Nutrition & Diet: Calorie budgeting, macronutrient distributions, specialized diet structures, and clinical nutrition disclaimers.",
      "Fitness & Workouts: Strength progression, cardiovascular programming, HIIT intervals, muscle hyper-trophy, and recovery methods.",
      "Supplementation: Evidence-based benefits and guidelines for protein, creatine, vitamins, and minerals.",
      "Habit Tracking: Hydration, sleep cycle optimization, and long-term behavioral change strategies."
    ]
  },
  weather_meteorology: {
    label: "Weather & Meteorology Intelligence",
    role: "Meteorologist & Climate Scientist",
    keywords: ["weather", "meteorology", "precipitation", "barometer", "humidity", "monsoon", "climate change", "cyclone", "tornado", "blizzard", "heatwave", "atmospheric", "microclimate", "clouds", "radar"],
    topics: [
      "Atmospheric Science: Barometric pressure variations, humidity profiles, wind currents, and clouds formation.",
      "Severe Weather Patterns: Early tracking of cyclones, tornadoes, blizzards, heatwaves, and emergency safety guidelines.",
      "Analytical Tools: Doppler radars, satellite imagery interpretation, and predictive climate modeling.",
      "Monsoon & Localized Climate: Micro-climate deviations and rainfall distribution models."
    ]
  },
  gaming_dev: {
    label: "Gaming & Game Development",
    role: "Game Producer & Gameplay Architect",
    keywords: ["game dev", "game development", "unity", "unreal engine", "godot", "gameplay", "game design", "game mechanics", "level design", "shader", "rendering", "esports", "streaming", "twitch", "game engine"],
    topics: [
      "Game Engines: Implementation patterns in Unity (C#), Unreal Engine (C++/Blueprints), and Godot.",
      "Gameplay & Level Design: Crafting responsive mechanics, core loops, spatial logic, and environmental storytelling.",
      "Graphics & Rendering: Custom shaders, optimization pipelines, draw call reductions, and frame rate preservation.",
      "Gaming Ecosystems: Esports tournament configurations, streaming technical setups, and spectator engagement models."
    ]
  },
  quantum_computing: {
    label: "Quantum Computing & Tech",
    role: "Quantum Physicist & Quantum Developer",
    keywords: ["quantum computing", "quantum technology", "quantum technologies", "quantum tech", "qubit", "superposition", "entanglement", "quantum gate", "qiskit", "quantum cryptography", "quantum annealing", "quantum hardware", "quantum supremacy"],
    topics: [
      "Quantum Mechanics: Quantum superposition, entanglement, decoherence, and qubit architectures (superconducting, trapped ion).",
      "Quantum Algorithms: Shor's and Grover's algorithms, VQE, and QAOA.",
      "Software Development: Writing circuits in Qiskit, Cirq, and execution on quantum hardware simulators.",
      "Cryptography & Security: Post-quantum cryptography standards and QKD protocols."
    ]
  },
  blockchain_web3: {
    label: "Blockchain & Web3 Intelligence",
    role: "Web3 Solutions Architect & Smart Contract Developer",
    keywords: ["blockchain", "web3", "cryptocurrency", "smart contract", "solidity", "ethereum", "bitcoin", "nft", "defi", "dapp", "dao", "tokenomics", "ipfs", "evm", "solana", "gas fees"],
    topics: [
      "Distributed Ledger Technology: Consensus mechanisms (PoW, PoS, PoH), block validation, and cryptoeconomic design.",
      "Smart Contracts: Writing secure Solidity/Rust code, auditing common vulnerabilities (reentrancy, overflow), and EVM mechanics.",
      "Decentralized Applications (dApps): Wallet integrations (Web3.js, Ethers.js), IPFS setups, and tokenomics models.",
      "DeFi & Governance: Yield farming mechanisms, liquidity pools, DAOs, and governance architectures."
    ]
  },
  veterinary_wildlife: {
    label: "Veterinary & Wildlife Sciences",
    role: "Veterinary Surgeon & Wildlife Biologist",
    keywords: ["veterinary", "wildlife", "zoology", "vet", "pets health", "veterinarian", "animal care", "mammal", "reptile", "biodiversity", "habitat conservation", "zoological", "animal behavior"],
    topics: [
      "Clinical Veterinary Care: Diagnostics, pathology, immunization schedules, surgical procedures, and triage disclaimers.",
      "Wildlife Conservation: Ecological studies, habitat degradation, mapping corridors, and species protection guidelines.",
      "Animal Behavior: Ethological observations, animal social patterns, and rehabilitation methodologies.",
      "Zoonotic Diseases: Prevention of cross-species transmission (Rabies, Avian Influenza)."
    ]
  },
  scientific_research: {
    label: "Scientific Research & Review",
    role: "Lead Scientific Researcher",
    keywords: ["scientific research", "literature review", "scientific paper", "academic study", "peer review", "citation index", "research paper", "hypothesis formulation", "methodology review"],
    topics: [
      "Literature Synthesis: Systematically mapping existing studies, identifying paradigm shifts, and detecting literature gaps.",
      "Hypothesis Formulation: Structuring testable, falsifiable scientific statements.",
      "Peer Review & Standards: Reviewing validation procedures, citation metrics (h-index), and journal classifications.",
      "Citation Formats: APA, IEEE, Harvard, and Chicago referencing styles."
    ]
  },
  economics_macro: {
    label: "Economics & Macroeconomics",
    role: "Macroeconomist & Policy Analyst",
    keywords: ["economics", "macroeconomics", "microeconomics", "inflation", "gdp", "interest rate", "fiscal policy", "monetary policy", "central bank", "supply demand", "recession", "econometrics", "tariff"],
    topics: [
      "Macroeconomic Theory: Gross Domestic Product dynamics, inflation forecasting, interest rate adjustments, and business cycle analysis.",
      "Monetary & Fiscal Policy: Central banking systems (RBI, Federal Reserve), open market operations, and tax reforms.",
      "Microeconomic Concepts: Consumer utility, market structures, price elasticity, and game theory applications.",
      "Econometrics: Linear regression, forecasting models, and quantitative data validation."
    ]
  },
  genetics_genomics: {
    label: "Genetics & Genomics",
    role: "Geneticist & Genomics Researcher",
    keywords: ["genetics", "genomics", "dna", "rna", "crispr", "gene editing", "gene therapy", "chromosome", "sequencing", "genome", "mutation", "hereditary", "synthetic biology"],
    topics: [
      "Genomics & DNA Sequencing: Next-Generation Sequencing (NGS), genome assembly, sequence mapping, and variant calling.",
      "Gene Editing Technologies: CRISPR-Cas9 mechanism, double-strand break repair pathways, and off-target validations.",
      "Gene Expression & Regulation: Transcription, translation, epigenetics, and chromatin modeling.",
      "Therapeutic Applications: Gene therapies, hereditary disease tracking, and molecular diagnostics."
    ]
  },
  pharmaceuticals: {
    label: "Pharmaceuticals Intelligence",
    role: "Pharmacologist & Clinical Trials Manager",
    keywords: ["pharmaceutical", "drug discovery", "clinical trials", "fda", "clinical trial", "pharmacokinetics", "pharmacodynamics", "formulation", "pharma", "drug safety", "biotech"],
    topics: [
      "Drug Discovery Pipeline: Target identification, lead optimization, high-throughput screening, and preclinical testing.",
      "Clinical Trials (Phases I-IV): Study designs, patient cohort selection, safety endpoints, and biostatistics protocols.",
      "Pharmacokinetics & Pharmacodynamics (PK/PD): Absorption, distribution, metabolism, excretion (ADME), and drug-receptor mechanics.",
      "Regulatory Approvals: FDA/EMA/CDSCO pathways, drug safety reporting, and compliance guidelines."
    ]
  },
  neuroscience: {
    label: "Neuroscience Intelligence",
    role: "Neuroscientist & Cognitive Researcher",
    keywords: ["neuroscience", "neuron", "synapse", "neurotransmitter", "brain cortex", "neural plasticity", "neurodegenerative", "cognitive science", "fMRI", "neural network"],
    topics: [
      "Neuroanatomy: Brain divisions, cerebral cortex functions, brainstem pathways, and limbic system mechanics.",
      "Neurobiology: Action potentials, synaptic transmissions, and neurotransmitter regulations.",
      "Neuroplasticity & Learning: Synaptic pruning, long-term potentiation (LTP), and neural recovery pathways.",
      "Neurodegenerative Disorders: Pathology of Alzheimer's, Parkinson's, and ALS."
    ]
  },
  agriculture_livestock: {
    label: "Agriculture & Livestock",
    role: "Agricultural Scientist & Livestock Specialist",
    keywords: ["agriculture", "crop yield", "soil health", "irrigation", "farming", "livestock", "poultry", "cattle", "milking", "dairy farming", "crop rotation", "pest control", "organic farming", "agronomy"],
    topics: [
      "Agronomy & Soil Science: NPK monitoring, soil pH corrections, crop rotation models, and sustainable agriculture.",
      "Water Resource Management: Drip irrigation systems, rainwater harvesting, and runoff management.",
      "Livestock & Dairy Management: Breeding optimization, dairy production pipelines, poultry husbandry, and veterinary diagnostics.",
      "Pest & Disease Control: Organic and integrated pest management (IPM) structures."
    ]
  },
  manufacturing_mining: {
    label: "Manufacturing & Mining",
    role: "Industrial Process Engineer & Mining Specialist",
    keywords: ["manufacturing", "mining", "lean manufacturing", "six sigma", "supply chain", "ore", "extraction", "geotechnical", "cnc", "industrial automation", "machining", "excavation"],
    topics: [
      "Manufacturing Operations: Lean manufacturing principles, Six Sigma process control, supply chain optimization, and CNC programming.",
      "Mining & Resource Extraction: Ore body mapping, open-pit and underground mining methods, and mineral processing layouts.",
      "Automation & Robotics: Programmable Logic Controllers (PLCs), industrial arm mechanics, and SCADA monitoring systems.",
      "Safety & Geotechnical Hazards: Ground stability analysis, structural reinforcement, and hazard mitigation."
    ]
  },
  intl_trade: {
    label: "International Trade",
    role: "Trade Policy Advisor & Global Supply Chain Expert",
    keywords: ["international trade", "global trade", "supply chain", "customs", "export import", "incoterms", "tariffs", "trade agreement", "wto", "logistic", "customs clearance"],
    topics: [
      "Global Logistics & Supply Chain: Shipping container optimization, customs declarations, freight forwarding, and inventory distribution.",
      "Trade Policies & Regulations: World Trade Organization (WTO) guidelines, bilateral agreements, and tariff computations.",
      "Incoterms & Documentation: Drafting bills of lading, letters of credit, and certificate of origin standards.",
      "Risk Mitigation: Hedging against exchange rate fluctuations and supply chain disruptions."
    ]
  },
  sports_mgmt: {
    label: "Sports Management",
    role: "Sports Administrator & Athletic Performance Director",
    keywords: ["sports management", "sports analytics", "sports coaching", "team management", "athlete training", "sports marketing", "sports agency", "athletic department"],
    topics: [
      "Athletic Operations: Roster construction, cap space management, and regulatory compliance in professional leagues.",
      "Sports Performance Analytics: GPS tracking systems, biomechanics optimization, and player workload management.",
      "Sports Business: Sponsor acquisitions, stadium logistics, and player contract negotiations.",
      "Coaching Strategy: Tactical review, opponent profiling, and mental conditioning."
    ]
  },
  events_conf: {
    label: "Events & Conference Intelligence",
    role: "Lead Event Operations Manager",
    keywords: ["event planning", "conference planning", "event operations", "expo", "convention", "event catering", "corporate events", "event budgeting", "stage management"],
    topics: [
      "Operational Logistics: Floor plan designs, stage management, audio-visual technical specs, and crowd flow routing.",
      "Event Finance: Vendor bidding processes, budgeting spreadsheets, and profit-margin optimizations.",
      "Technology Integrations: Ticketing systems, digital registration platforms, and hybrid event broadcast routing.",
      "Crisis Management: Fire safety regulations, medical support placement, and emergency evacuation plans."
    ]
  },
  gis_mapping: {
    label: "GIS & Mapping Intelligence",
    role: "GIS Analyst & Cartographer",
    keywords: ["gis", "mapping", "cartography", "spatial analysis", "shapefile", "qgis", "arcgis", "coordinate system", "lidar", "remote sensing", "gps tracking", "geospatial"],
    topics: [
      "Geospatial Analysis: Vector/raster data modeling, spatial joins, buffering, and terrain analysis.",
      "Software Systems: Map production in ArcGIS Pro and QGIS, Python (ArcPy, GDAL) automation scripts.",
      "Remote Sensing & LiDAR: Point cloud classification, NDVI computations, and multispectral imagery processing.",
      "Geodesy & Coordinate Systems: Projecting coordinates (WGS84, UTM zones) and orthorectification."
    ]
  },
  geology_earth: {
    label: "Geology & Earth Systems",
    role: "Geologist & Hydrologist",
    keywords: ["geology", "earth systems", "hydrology", "seismology", "plate tectonics", "mineralogy", "rock cycle", "groundwater", "aquifer", "sediment", "volcanology", "soil strata"],
    topics: [
      "Geological Science: Plate tectonics dynamics, rock classification, stratigraphy mapping, and mineral analysis.",
      "Hydrological Engineering: Aquifer modeling, groundwater flow simulation, runoff modeling, and river systems analysis.",
      "Seismology & Volcanology: Seismic wave analysis, faults mapping, and volcanic hazard zones identification.",
      "Soil Geotechnics: Testing soil strata load capacity and excavation planning."
    ]
  },
  oceanography: {
    label: "Oceanography Intelligence",
    role: "Oceanographer & Marine Scientist",
    keywords: ["oceanography", "marine biology", "ocean currents", "tide", "marine ecosystem", "ocean floor", "bathymetry", "salinity", "coral reef", "deep sea", "ocean acidification"],
    topics: [
      "Physical Oceanography: Thermohaline circulation, ocean wave mechanics, global tide modeling, and salinity profiles.",
      "Marine Biology & Ecology: Coral reef restoration models, deep-sea hydrothermal vent ecologies, and marine food webs.",
      "Bathymetric Mapping: Sonar soundings analysis and continental shelf geological mapping.",
      "Chemical Oceanography: Ocean acidification trends and carbon sequestration capacity studies."
    ]
  },
  accounting_taxation: {
    label: "Accounting, Auditing & Taxation",
    role: "Chartered Accountant & Financial Auditor",
    keywords: ["accounting", "auditing", "taxation", "income tax", "gst", "corporate tax", "double entry", "balance sheet", "ledger", "audit trail", "financial statement", "compliance", "tax filing"],
    topics: [
      "Double-Entry Accounting: Adjusting journal entries, general ledgers, trial balances, and financial statement generation.",
      "Corporate Auditing: Designing audit procedures, verifying internal controls, testing transactions, and certifying balances.",
      "Taxation Frameworks: Income tax planning, corporate tax returns, Goods and Services Tax (GST) accounting, and tax compliance audits.",
      "Standards & Regulations: GAAP and IFRS implementation patterns."
    ]
  },
  project_management: {
    label: "Project Management Intelligence",
    role: "Project Manager & Scrum Master",
    keywords: ["project management", "scrum", "agile", "kanban", "pmp", "gantt chart", "critical path", "wbs", "sprint planning", "stakeholder management", "jira"],
    topics: [
      "Agile & Scrum Methodologies: Running sprint planning, backlog grooming, retrospectives, and velocity charts analysis.",
      "Waterfall & Hybrid Planning: Constructing Work Breakdown Structures (WBS), Gantt charts, and Critical Path Method (CPM) analyses.",
      "Risk & Resource Management: Identifying dependency bottlenecks, resource allocation mapping, and risk registries.",
      "KPI Reporting: Project performance indicators (SPI, CPI, EVA)."
    ]
  },
  parenting_relationships: {
    label: "Parenting & Relationships",
    role: "Relationship Counselor & Child Development Advisor",
    keywords: ["parenting", "relationships", "marriage", "family", "toddler", "schooling", "discipline child", "child behavior", "relationship advice", "marriage counseling", "conflict resolution", "child psychology", "elder care"],
    topics: [
      "Parenting & Child Development: Child milestones, behavioral corrections, education schooling options, and positive discipline models.",
      "Relationship Counseling: Active communication scripts, resolving trust issues, boundary setting, and marriage guidance.",
      "Child Psychology: Cognitive development stages, tracking emotional security, and social adjustment patterns.",
      "Elderly & Family Care: Managing age-related transitions, geriatric health coordination, and family dynamics."
    ]
  },
  self_improvement: {
    label: "Self-Improvement & Productivity",
    role: "Productivity Coach & Mindfulness Instructor",
    keywords: ["self-improvement", "productivity", "meditation", "mindfulness", "wellbeing", "happiness", "gtd", "pomodoro", "okrs", "smart goals", "habits", "eisenhower matrix", "focus", "time blocking"],
    topics: [
      "Productivity Frameworks: OKRs, SMART goals, Getting Things Done (GTD) systems, and Eisenhower matrices.",
      "Mindfulness & Meditation: Guided breathing techniques, stress reduction exercises, and cognitive focus models.",
      "Habit Modification: Habit loop design (cue, routine, reward), habit tracking metrics, and behavioral restructuring.",
      "Emotional Wellbeing: Restructuring negative self-talk, anxiety management, and work-life boundaries."
    ]
  },
  ui_ux_design: {
    label: "UI/UX & Design Intelligence",
    role: "UI/UX Designer & Creative Director",
    keywords: ["ui/ux", "graphic design", "typography", "wireframe", "figma", "usability", "color theory", "user research", "illustration", "layout", "branding", "logo"],
    topics: [
      "User Experience (UX): Usability test designs, mapping user journeys, wireframing, and interactive prototyping layouts.",
      "User Interface (UI): Layout grids, spatial constraints, color theory rules, typography hierarchy, and UI system design.",
      "Graphic Design & Illustration: Visual asset design, vector paths, composition rules, and vector file layout standards.",
      "Brand Identity: Logo grids, design guidelines, packaging mockups, and visual styling guidelines."
    ]
  },
  core_engineering: {
    label: "Engineering Sciences Engine",
    role: "Multi-Disciplinary Engineering Consultant",
    keywords: ["mechanical engineering", "civil engineering", "electrical engineering", "electronics engineering", "industrial engineering", "aerospace engineering", "marine engineering", "thermodynamics", "structural design", "circuits", "fluids", "aerodynamics"],
    topics: [
      "Mechanical Engineering: Fluid mechanics modeling, thermal system designs, thermodynamics, and CAD structural validations.",
      "Civil Engineering: Reinforced concrete designs, structural analysis, foundation loads, and soil mechanic parameters.",
      "Electrical & Electronics Engineering: Circuit network solving, signal processing filters, and microcontrollers architecture.",
      "Aerospace & Marine Systems: Aerodynamics lift-to-drag formulas, aircraft staging dynamics, and ship hydrodynamics.",
      "Industrial Systems: Operations research models, optimization pipelines, queuing theory, and lean production layouts."
    ]
  },
  human_mind_society: {
    label: "Sociology & Anthropology Sciences",
    role: "Sociologist & Anthropologist",
    keywords: ["sociology", "anthropology", "human mind", "social theory", "cultural ethnography", "social structure", "human evolution", "tribal studies", "cultural anthropology", "social norms"],
    topics: [
      "Sociological Analysis: Social stratification models, institutional dynamics, collective behavior, and tracking social norms.",
      "Anthropology & Ethnography: Cultural ethnographies, linguistic tracking, kinships structures, and human evolution tracing.",
      "Social Stratification: Gender structures, socio-economic classes, and cultural capital dynamics.",
      "Research Methodologies: Designing qualitative research, conducting field observations, and case studies analysis."
    ]
  },
  aging_gerontology: {
    label: "Gerontology & Elder Care",
    role: "Gerontologist & Eldercare Coordinator",
    keywords: ["aging", "gerontology", "elder care", "senior care", "geriatric", "age related", "retirement planning", "dementia care", "palliative care", "assisted living"],
    topics: [
      "Geriatric Science: Biology of senescence, age-related physiological changes, and functional decline tracking.",
      "Eldercare Planning: Assisted living validations, custom mobility designs, medication organization, and tracking cognitive declines.",
      "Dementia & Memory Care: Behavioral triggers management, spatial adjustments, and cognitive stimulation therapies.",
      "Legal & Estate Support: Living wills templates, power of attorney setups, and long-term care finance."
    ]
  },
  advanced_life_sciences: {
    label: "Advanced Life Sciences",
    role: "Life Sciences Researcher & Biologist",
    keywords: ["microbiology", "immunology", "life sciences", "biology", "cell biology", "pathogen", "antibody", "antigen", "virology", "bacteriology", "molecular biology", "cellular"],
    topics: [
      "Microbiology: Pathogenesis pathways, bacterial classification, viral replication cycles, and staining methods.",
      "Immunology: Innate vs adaptive immune responses, antibody structure, antigen presentation, and vaccine biology.",
      "Cellular Biology: Organelle function, signaling pathways, and cell cycle checkpoints.",
      "Molecular Techniques: PCR optimization, western blotting, and recombinant DNA technology."
    ]
  },
  dentistry_ophthalmology: {
    label: "Dentistry & Ophthalmology",
    role: "Oral & Vision Specialist",
    keywords: ["dentistry", "ophthalmology", "dental", "vision", "eye care", "oral health", "glaucoma", "cataract", "orthodontic", "teeth", "retina", "periodontal"],
    topics: [
      "Dentistry & Oral Health: Periodontal treatment protocols, endodontic techniques, cavity fillings, and orthodontic mechanics.",
      "Ophthalmology & Optometry: Optical refractometry, glaucoma diagnostics, macular degeneration pathways, and retina health profiles.",
      "Diagnostic Imaging: Panoramic dental X-rays, Optical Coherence Tomography (OCT) scans, and tonometry.",
      "Clinical Disclaimers: Referral requirements and general oral/vision disclaimers."
    ]
  },
  disaster_management: {
    label: "Disaster Management & Recovery",
    role: "Disaster Response Director & Incident Commander",
    keywords: ["disaster management", "emergency response", "disaster recovery", "incident command", "fema", "evacuation planning", "first aid", "fire safety", "hazard mitigation", "rescue operations"],
    topics: [
      "Disaster Mitigation: Flood control models, earthquake retrofitting specs, and public warning system designs.",
      "Incident Response Framework: Incident Command System (ICS) setups, staging triage centers, and rescue ops coordination.",
      "Disaster Recovery: Debris management plans, public health restorations, and structural safety certifications.",
      "Policing & Fire Coordination: Police crowd control, fire rescue lines, and hazmat response."
    ]
  },
  glaciology_desert: {
    label: "Glaciology & Desert Studies",
    role: "Climatologist & Arid Zone Researcher",
    keywords: ["glaciology", "desert studies", "glacier", "ice sheet", "arid zone", "desertification", "permafrost", "sand dunes", "oasis", "polar research"],
    topics: [
      "Glaciology Science: Ice flow mechanics, ablation computations, calving events, and permafrost profiling.",
      "Arid Zones Ecology: Desertification mitigation models, xerophytic plant adaptations, and sand dune stabilizing methods.",
      "Hydrological Patterns: Glacier meltwater routing and oasis hydrology.",
      "Climate Indicators: Polar ice core analysis, carbon gas trapping, and paleoclimate reconstructions."
    ]
  },
  digital_media: {
    label: "Digital Media & Podcasts",
    role: "Media Producer & Content Strategist",
    keywords: ["podcast", "streaming", "twitch", "youtube live", "broadcasting", "digital media", "video production", "audio recording", "content creator", "publishing"],
    topics: [
      "Audio Production: Signal chains, noise gate configurations, compression settings, and sample rate settings.",
      "Video Production: Lighting designs (three-point), camera settings (aperture, ISO), and editing workflow schemas.",
      "Streaming Mechanics: OBS configurations, bitrate controls, RTMP stream keys, and overlay management.",
      "Distribution Models: RSS feeds syndication, metadata optimization, and digital licensing standards."
    ]
  },
  mobile_app_dev: {
    label: "Mobile Application Engineering",
    role: "Lead Mobile Architect",
    keywords: ["mobile app", "react native", "flutter", "swift", "kotlin", "android studio", "ios app", "app store", "play store", "mobile UI"],
    topics: [
      "Cross-Platform Engineering: App builds using React Native and Flutter, native bridging, and performance optimization.",
      "Native SDKs: Swift/SwiftUI architectures, Kotlin layouts, coroutines, and Android Jetpack libraries.",
      "Lifecycle Management: Handling background states, memory management, and local storage caches (SQLite, Realm).",
      "App Deployment: CI/CD build scripts, TestFlight configurations, App Store connect guidelines, and Play Store releases."
    ]
  },
  frontier_technology: {
    label: "Frontier Technology Engine",
    role: "Emerging Technology Consultant",
    keywords: ["agi research", "multi-agent systems", "synthetic biology", "space colonization", "human augmentation", "neurotechnology", "brain computer interface", "nanotech"],
    topics: [
      "Artificial General Intelligence (AGI): Cognitive architectures, reasoning layers, and alignment mechanisms.",
      "Multi-Agent Architectures: Agent coordination protocols, consensus systems, and distributed execution topologies.",
      "Synthetic Biology: Designing metabolic pathways, codon optimization, and DNA synthesis specifications.",
      "Space Colonization & Tech: Life support systems (ECLSS), regolith processing, Mars base staging, and satellite propulsion.",
      "Human Augmentation: Neural interfaces (BCI), exoskeleton designs, and sensory enhancements."
    ]
  },
  home_management: {
    label: "Home & Household Management",
    role: "Home Management Specialist",
    keywords: ["home management", "household", "personal styling", "beauty", "skincare", "closet organization", "interior layout", "house maintenance"],
    topics: [
      "Household Operations: Inventory tracking, seasonal maintenance plans, home budgeting, and organization systems.",
      "Personal Styling & Beauty: Wardrobe color coordination, styling guides, and textile properties.",
      "Skincare & Wellness: Formulations breakdown, identification of skin types, and safe product routines.",
      "Interior Layout: Lighting layouts, ergonomic spacing, and functional furniture positioning."
    ]
  },
  ornithology_aquaculture: {
    label: "Animal & Marine Sciences",
    role: "Zoologist & Fisheries Scientist",
    keywords: ["ornithology", "aquaculture", "apiculture", "equine", "birds", "fish farming", "beekeeping", "horses", "poultry health"],
    topics: [
      "Ornithology: Bird species migration mapping, nesting tracking, and diagnostic bird health profiles.",
      "Aquaculture & Fisheries: Water quality chemistry, stocking densities, fish feed formulas, and biofloc engineering.",
      "Apiculture: Bee hive designs, disease control (varroa mites), and honey extraction processes.",
      "Equine Science: Equine nutrition, hoof care routines, biomechanics, and stable layouts."
    ]
  },
  research_ecosystem: {
    label: "Research Methodology & Stats",
    role: "Principal Biostatistician & Methodologist",
    keywords: ["research methodology", "survey design", "statistics", "experiment design", "sample size", "anova", "t-test", "confidence interval", "null hypothesis", "biostatistics"],
    topics: [
      "Quantitative Research Design: Designing randomized controlled trials, block randomization, and cohort studies.",
      "Biostatistics & Testing: Formulating null hypotheses, executing ANOVA, t-tests, Chi-square tests, and calculating p-values.",
      "Survey Design: Constructing Likert scales, sampling methods, and verifying internal consistency (Cronbach's alpha).",
      "Experiment Optimization: Factorial designs and validation methods."
    ]
  },
  creative_writing_publishing: {
    label: "Creative Writing & Publishing",
    role: "Literary Editor & Publishing Consultant",
    keywords: ["creative writing", "publishing", "literary", "novel writing", "screenplay format", "editing proofreading", "manuscript formatting", "isbn", "self publishing"],
    topics: [
      "Storytelling Structures: Plot architectures (Three-Act, Hero's Journey), character arc mapping, and pacing models.",
      "Screenplay & Scripting: Standard screenplay formatting, dialog rules, and scene outline layouts.",
      "Publishing Logistics: Book metadata configurations, self-publishing channels, ISBN registration, and typesetting formatting.",
      "Editing Methodologies: Developmental editing, copyediting checklists, and proofreading annotations."
    ]
  },
  library_science_archival: {
    label: "Library Science & Archival",
    role: "Information Scientist & Archival Curator",
    keywords: ["library science", "archival", "museology", "archives", "museum", "dewey decimal", "cataloging", "digital preservation", "metadata schema", "heritage conservation"],
    topics: [
      "Information Cataloging: Dewey Decimal Classification, Library of Congress Classifications, and metadata schemas.",
      "Digital Archival: Preservation architectures, metadata standards (Dublin Core), and file formats standards.",
      "Museum Curation: Exhibition designs, temperature/humidity controls, and lighting configurations.",
      "Heritage Conservation: Artifact restoration procedures, archive digitization, and document safety."
    ]
  },
  diplomacy_strategic_studies: {
    label: "Diplomacy & Strategic Studies",
    role: "Diplomatic Envoy & National Security Advisor",
    keywords: ["diplomacy", "strategic studies", "intelligence studies", "peace conflict", "geopolitical strategy", "foreign policy", "peacebuilding", "conflict resolution", "statecraft"],
    topics: [
      "Diplomatic Statecraft: Foreign policy design, diplomatic negotiations protocols, and international treaty structures.",
      "Strategic Security: Deterrence theory, intelligence operations analysis, and mapping threat factors.",
      "Peace & Conflict Resolution: Conflict mapping, peacebuilding operations, and reconciliation protocols.",
      "Geopolitical Forecasting: Risk assessment maps for cross-border and regional conflicts."
    ]
  },
  public_policy_electoral: {
    label: "Public Policy & Electoral Systems",
    role: "Public Policy Analyst & Electoral Officer",
    keywords: ["public policy", "electoral", "voting system", "policy analysis", "legislative", "polling", "gerrymandering", "public administration", "civic engagement"],
    topics: [
      "Policy Formulation: Cost-benefit analyses, legislative drafting structures, and public feedback tracking.",
      "Electoral Engineering: Voting system architectures (FPTP, Ranked Choice), ballot designs, and audit protocols.",
      "Public Administration: Budget structures, program evaluations, and intergovernmental logistics.",
      "Demographics: Mapping electoral boundaries, analyzing demographics, and census analysis."
    ]
  },
  business_analytics: {
    label: "Business Analytics & Operations Research",
    role: "Principal Operations Analyst",
    keywords: ["business analytics", "operations research", "linear programming", "queuing theory", "predictive analytics", "optimization modeling", "inventory optimization", "decision tree"],
    topics: [
      "Operations Research: Simplex algorithm, linear programming models, transport optimizations, and queuing theory configurations.",
      "Predictive Analytics: Regression analysis, decision tree models, and forecasting market demands.",
      "Supply Chain Optimization: Inventory replenishment models (EOQ), safety stock calculations, and warehouse logistics.",
      "Business Intelligence: KPI scorecard layouts, data integration pipelines, and predictive analytics dashboards."
    ]
  },
  internet_infrastructure: {
    label: "Internet Infrastructure",
    role: "Network Architect & Systems Engineer",
    keywords: ["dns", "hosting", "isp", "networking", "ip routing", "bgp", "cisco", "subnetting", "fiber optic", "datacenter"],
    topics: [
      "IP Routing & Subnetting: IPv4/IPv6 address allocations, subnet mask calculations, and BGP routing configurations.",
      "DNS & Server Hosting: DNS record propagation, web hosting infrastructures, and load balancer setups.",
      "ISP Technologies: Fiber optic network designs, optical line terminals, and broadband routing.",
      "Datacenter Operations: Server cooling setups, backup generator configurations, and network security policies."
    ]
  },

  ai_agents_engine: {
    label: "AI Agents Engine",
    role: "Specialized AI Agents Engine Expert",
    keywords: [["ai","agents"], "ai agents engine"],
    topics: [
      "Core principles and best practices of AI Agents Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  generative_ai_engine: {
    label: "Generative AI Engine",
    role: "Specialized Generative AI Engine Expert",
    keywords: [["generative","ai"], "generative ai engine"],
    topics: [
      "Core principles and best practices of Generative AI Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  llm_intelligence_engine: {
    label: "LLM Intelligence Engine",
    role: "Specialized LLM Intelligence Engine Expert",
    keywords: [["llm"], "llm intelligence engine"],
    topics: [
      "Core principles and best practices of LLM Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  mcp_intelligence_engine: {
    label: "MCP Intelligence Engine",
    role: "Specialized MCP Intelligence Engine Expert",
    keywords: [["mcp"], "mcp intelligence engine"],
    topics: [
      "Core principles and best practices of MCP Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  robotics_engine: {
    label: "Robotics Engine",
    role: "Specialized Robotics Engine Expert",
    keywords: [["robotics"], "robotics engine"],
    topics: [
      "Core principles and best practices of Robotics Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cybersecurity_engine: {
    label: "Cybersecurity Engine",
    role: "Specialized Cybersecurity Engine Expert",
    keywords: [["cybersecurity"], "cybersecurity engine"],
    topics: [
      "Core principles and best practices of Cybersecurity Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cloud_computing_engine: {
    label: "Cloud Computing Engine",
    role: "Specialized Cloud Computing Engine Expert",
    keywords: [["cloud","computing"], "cloud computing engine"],
    topics: [
      "Core principles and best practices of Cloud Computing Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  telecommunications_engine: {
    label: "Telecommunications Engine",
    role: "Specialized Telecommunications Engine Expert",
    keywords: [["telecommunications"], "telecommunications engine"],
    topics: [
      "Core principles and best practices of Telecommunications Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  startup_intelligence_engine: {
    label: "Startup Intelligence Engine",
    role: "Specialized Startup Intelligence Engine Expert",
    keywords: [["startup"], "startup intelligence engine"],
    topics: [
      "Core principles and best practices of Startup Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  stock_market_intelligence_engine: {
    label: "Stock Market Intelligence Engine",
    role: "Specialized Stock Market Intelligence Engine Expert",
    keywords: [["stock","market"], "stock market intelligence engine"],
    topics: [
      "Core principles and best practices of Stock Market Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  personal_finance_engine: {
    label: "Personal Finance Engine",
    role: "Specialized Personal Finance Engine Expert",
    keywords: [["personal","finance"], "personal finance engine"],
    topics: [
      "Core principles and best practices of Personal Finance Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  banking_intelligence_engine: {
    label: "Banking Intelligence Engine",
    role: "Specialized Banking Intelligence Engine Expert",
    keywords: [["banking"], "banking intelligence engine"],
    topics: [
      "Core principles and best practices of Banking Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  insurance_intelligence_engine: {
    label: "Insurance Intelligence Engine",
    role: "Specialized Insurance Intelligence Engine Expert",
    keywords: [["insurance"], "insurance intelligence engine"],
    topics: [
      "Core principles and best practices of Insurance Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  accounting_intelligence_engine: {
    label: "Accounting Intelligence Engine",
    role: "Specialized Accounting Intelligence Engine Expert",
    keywords: [["accounting"], "accounting intelligence engine"],
    topics: [
      "Core principles and best practices of Accounting Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  taxation_intelligence_engine: {
    label: "Taxation Intelligence Engine",
    role: "Specialized Taxation Intelligence Engine Expert",
    keywords: [["taxation"], "taxation intelligence engine"],
    topics: [
      "Core principles and best practices of Taxation Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  medical_intelligence_engine: {
    label: "Medical Intelligence Engine",
    role: "Specialized Medical Intelligence Engine Expert",
    keywords: [["medical"], "medical intelligence engine"],
    topics: [
      "Core principles and best practices of Medical Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  healthcare_engine: {
    label: "Healthcare Engine",
    role: "Specialized Healthcare Engine Expert",
    keywords: [["healthcare"], "healthcare engine"],
    topics: [
      "Core principles and best practices of Healthcare Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  pharmacy_intelligence_engine: {
    label: "Pharmacy Intelligence Engine",
    role: "Specialized Pharmacy Intelligence Engine Expert",
    keywords: [["pharmacy"], "pharmacy intelligence engine"],
    topics: [
      "Core principles and best practices of Pharmacy Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  genetics_intelligence_engine: {
    label: "Genetics Intelligence Engine",
    role: "Specialized Genetics Intelligence Engine Expert",
    keywords: [["genetics"], "genetics intelligence engine"],
    topics: [
      "Core principles and best practices of Genetics Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  nutrition_intelligence_engine: {
    label: "Nutrition Intelligence Engine",
    role: "Specialized Nutrition Intelligence Engine Expert",
    keywords: [["nutrition"], "nutrition intelligence engine"],
    topics: [
      "Core principles and best practices of Nutrition Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  fitness_intelligence_engine: {
    label: "Fitness Intelligence Engine",
    role: "Specialized Fitness Intelligence Engine Expert",
    keywords: [["fitness"], "fitness intelligence engine"],
    topics: [
      "Core principles and best practices of Fitness Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  travel_planning_engine: {
    label: "Travel Planning Engine",
    role: "Specialized Travel Planning Engine Expert",
    keywords: [["travel","planning"], "travel planning engine"],
    topics: [
      "Core principles and best practices of Travel Planning Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  hotel_intelligence_engine: {
    label: "Hotel Intelligence Engine",
    role: "Specialized Hotel Intelligence Engine Expert",
    keywords: [["hotel"], "hotel intelligence engine"],
    topics: [
      "Core principles and best practices of Hotel Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  flight_intelligence_engine: {
    label: "Flight Intelligence Engine",
    role: "Specialized Flight Intelligence Engine Expert",
    keywords: [["flight"], "flight intelligence engine"],
    topics: [
      "Core principles and best practices of Flight Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  railway_intelligence_engine: {
    label: "Railway Intelligence Engine",
    role: "Specialized Railway Intelligence Engine Expert",
    keywords: [["railway"], "railway intelligence engine"],
    topics: [
      "Core principles and best practices of Railway Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  bus_booking_intelligence_engine: {
    label: "Bus Booking Intelligence Engine",
    role: "Specialized Bus Booking Intelligence Engine Expert",
    keywords: [["bus","booking"], "bus booking intelligence engine"],
    topics: [
      "Core principles and best practices of Bus Booking Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  taxi_mobility_engine: {
    label: "Taxi & Mobility Engine",
    role: "Specialized Taxi & Mobility Engine Expert",
    keywords: [["taxi","&","mobility"], "taxi & mobility engine"],
    topics: [
      "Core principles and best practices of Taxi & Mobility Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  maritime_intelligence_engine: {
    label: "Maritime Intelligence Engine",
    role: "Specialized Maritime Intelligence Engine Expert",
    keywords: [["maritime"], "maritime intelligence engine"],
    topics: [
      "Core principles and best practices of Maritime Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  movie_intelligence_engine: {
    label: "Movie Intelligence Engine",
    role: "Specialized Movie Intelligence Engine Expert",
    keywords: [["movie"], "movie intelligence engine"],
    topics: [
      "Core principles and best practices of Movie Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ott_intelligence_engine: {
    label: "OTT Intelligence Engine",
    role: "Specialized OTT Intelligence Engine Expert",
    keywords: [["ott"], "ott intelligence engine"],
    topics: [
      "Core principles and best practices of OTT Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  celebrity_intelligence_engine: {
    label: "Celebrity Intelligence Engine",
    role: "Specialized Celebrity Intelligence Engine Expert",
    keywords: [["celebrity"], "celebrity intelligence engine"],
    topics: [
      "Core principles and best practices of Celebrity Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  music_intelligence_engine: {
    label: "Music Intelligence Engine",
    role: "Specialized Music Intelligence Engine Expert",
    keywords: [["music"], "music intelligence engine"],
    topics: [
      "Core principles and best practices of Music Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  song_analysis_engine: {
    label: "Song Analysis Engine",
    role: "Specialized Song Analysis Engine Expert",
    keywords: [["song","analysis"], "song analysis engine"],
    topics: [
      "Core principles and best practices of Song Analysis Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  anime_intelligence_engine: {
    label: "Anime Intelligence Engine",
    role: "Specialized Anime Intelligence Engine Expert",
    keywords: [["anime"], "anime intelligence engine"],
    topics: [
      "Core principles and best practices of Anime Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  tv_shows_intelligence_engine: {
    label: "TV Shows Intelligence Engine",
    role: "Specialized TV Shows Intelligence Engine Expert",
    keywords: [["tv","shows"], "tv shows intelligence engine"],
    topics: [
      "Core principles and best practices of TV Shows Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cinema_intelligence_engine: {
    label: "Cinema Intelligence Engine",
    role: "Specialized Cinema Intelligence Engine Expert",
    keywords: [["cinema"], "cinema intelligence engine"],
    topics: [
      "Core principles and best practices of Cinema Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  career_intelligence_engine: {
    label: "Career Intelligence Engine",
    role: "Specialized Career Intelligence Engine Expert",
    keywords: [["career"], "career intelligence engine"],
    topics: [
      "Core principles and best practices of Career Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  interview_preparation_engine: {
    label: "Interview Preparation Engine",
    role: "Specialized Interview Preparation Engine Expert",
    keywords: [["interview","preparation"], "interview preparation engine"],
    topics: [
      "Core principles and best practices of Interview Preparation Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  resume_intelligence_engine: {
    label: "Resume Intelligence Engine",
    role: "Specialized Resume Intelligence Engine Expert",
    keywords: [["resume"], "resume intelligence engine"],
    topics: [
      "Core principles and best practices of Resume Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  skill_roadmap_engine: {
    label: "Skill Roadmap Engine",
    role: "Specialized Skill Roadmap Engine Expert",
    keywords: [["skill","roadmap"], "skill roadmap engine"],
    topics: [
      "Core principles and best practices of Skill Roadmap Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  exam_preparation_engine: {
    label: "Exam Preparation Engine",
    role: "Specialized Exam Preparation Engine Expert",
    keywords: [["exam","preparation"], "exam preparation engine"],
    topics: [
      "Core principles and best practices of Exam Preparation Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  news_intelligence_engine: {
    label: "News Intelligence Engine",
    role: "Specialized News Intelligence Engine Expert",
    keywords: [["news"], "news intelligence engine"],
    topics: [
      "Core principles and best practices of News Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  current_affairs_engine: {
    label: "Current Affairs Engine",
    role: "Specialized Current Affairs Engine Expert",
    keywords: [["current","affairs"], "current affairs engine"],
    topics: [
      "Core principles and best practices of Current Affairs Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  politics_governance_engine: {
    label: "Politics & Governance Engine",
    role: "Specialized Politics & Governance Engine Expert",
    keywords: [["politics","&","governance"], "politics & governance engine"],
    topics: [
      "Core principles and best practices of Politics & Governance Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  defense_intelligence_engine: {
    label: "Defense Intelligence Engine",
    role: "Specialized Defense Intelligence Engine Expert",
    keywords: [["defense"], "defense intelligence engine"],
    topics: [
      "Core principles and best practices of Defense Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  history_intelligence_engine: {
    label: "History Intelligence Engine",
    role: "Specialized History Intelligence Engine Expert",
    keywords: [["history"], "history intelligence engine"],
    topics: [
      "Core principles and best practices of History Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  legal_research_engine: {
    label: "Legal Research Engine",
    role: "Specialized Legal Research Engine Expert",
    keywords: [["legal","research"], "legal research engine"],
    topics: [
      "Core principles and best practices of Legal Research Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  physics_intelligence_engine: {
    label: "Physics Intelligence Engine",
    role: "Specialized Physics Intelligence Engine Expert",
    keywords: [["physics"], "physics intelligence engine"],
    topics: [
      "Core principles and best practices of Physics Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  chemistry_intelligence_engine: {
    label: "Chemistry Intelligence Engine",
    role: "Specialized Chemistry Intelligence Engine Expert",
    keywords: [["chemistry"], "chemistry intelligence engine"],
    topics: [
      "Core principles and best practices of Chemistry Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  mathematics_intelligence_engine: {
    label: "Mathematics Intelligence Engine",
    role: "Specialized Mathematics Intelligence Engine Expert",
    keywords: [["mathematics"], "mathematics intelligence engine"],
    topics: [
      "Core principles and best practices of Mathematics Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  biotechnology_intelligence_engine: {
    label: "Biotechnology Intelligence Engine",
    role: "Specialized Biotechnology Intelligence Engine Expert",
    keywords: [["biotechnology"], "biotechnology intelligence engine"],
    topics: [
      "Core principles and best practices of Biotechnology Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  astronomy_intelligence_engine: {
    label: "Astronomy Intelligence Engine",
    role: "Specialized Astronomy Intelligence Engine Expert",
    keywords: [["astronomy"], "astronomy intelligence engine"],
    topics: [
      "Core principles and best practices of Astronomy Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  environmental_intelligence_engine: {
    label: "Environmental Intelligence Engine",
    role: "Specialized Environmental Intelligence Engine Expert",
    keywords: [["environmental"], "environmental intelligence engine"],
    topics: [
      "Core principles and best practices of Environmental Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  manufacturing_intelligence_engine: {
    label: "Manufacturing Intelligence Engine",
    role: "Specialized Manufacturing Intelligence Engine Expert",
    keywords: [["manufacturing"], "manufacturing intelligence engine"],
    topics: [
      "Core principles and best practices of Manufacturing Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  logistics_intelligence_engine: {
    label: "Logistics Intelligence Engine",
    role: "Specialized Logistics Intelligence Engine Expert",
    keywords: [["logistics"], "logistics intelligence engine"],
    topics: [
      "Core principles and best practices of Logistics Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  supply_chain_intelligence_engine: {
    label: "Supply Chain Intelligence Engine",
    role: "Specialized Supply Chain Intelligence Engine Expert",
    keywords: [["supply","chain"], "supply chain intelligence engine"],
    topics: [
      "Core principles and best practices of Supply Chain Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  real_estate_intelligence_engine: {
    label: "Real Estate Intelligence Engine",
    role: "Specialized Real Estate Intelligence Engine Expert",
    keywords: [["real","estate"], "real estate intelligence engine"],
    topics: [
      "Core principles and best practices of Real Estate Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  agriculture_intelligence_engine: {
    label: "Agriculture Intelligence Engine",
    role: "Specialized Agriculture Intelligence Engine Expert",
    keywords: [["agriculture"], "agriculture intelligence engine"],
    topics: [
      "Core principles and best practices of Agriculture Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  livestock_intelligence_engine: {
    label: "Livestock Intelligence Engine",
    role: "Specialized Livestock Intelligence Engine Expert",
    keywords: [["livestock"], "livestock intelligence engine"],
    topics: [
      "Core principles and best practices of Livestock Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  international_trade_intelligence_engine: {
    label: "International Trade Intelligence Engine",
    role: "Specialized International Trade Intelligence Engine Expert",
    keywords: [["international","trade"], "international trade intelligence engine"],
    topics: [
      "Core principles and best practices of International Trade Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  social_media_intelligence_engine: {
    label: "Social Media Intelligence Engine",
    role: "Specialized Social Media Intelligence Engine Expert",
    keywords: [["social","media"], "social media intelligence engine"],
    topics: [
      "Core principles and best practices of Social Media Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  e_commerce_intelligence_engine: {
    label: "E-Commerce Intelligence Engine",
    role: "Specialized E-Commerce Intelligence Engine Expert",
    keywords: [["e-commerce"], "e-commerce intelligence engine"],
    topics: [
      "Core principles and best practices of E-Commerce Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  gaming_intelligence_engine: {
    label: "Gaming Intelligence Engine",
    role: "Specialized Gaming Intelligence Engine Expert",
    keywords: [["gaming"], "gaming intelligence engine"],
    topics: [
      "Core principles and best practices of Gaming Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ui_ux_intelligence_engine: {
    label: "UI/UX Intelligence Engine",
    role: "Specialized UI/UX Intelligence Engine Expert",
    keywords: [["ui/ux"], "ui/ux intelligence engine"],
    topics: [
      "Core principles and best practices of UI/UX Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  graphic_design_intelligence_engine: {
    label: "Graphic Design Intelligence Engine",
    role: "Specialized Graphic Design Intelligence Engine Expert",
    keywords: [["graphic","design"], "graphic design intelligence engine"],
    topics: [
      "Core principles and best practices of Graphic Design Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  photography_intelligence_engine: {
    label: "Photography Intelligence Engine",
    role: "Specialized Photography Intelligence Engine Expert",
    keywords: [["photography"], "photography intelligence engine"],
    topics: [
      "Core principles and best practices of Photography Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cardiology_intelligence: {
    label: "Cardiology Intelligence",
    role: "Specialized Cardiology Intelligence Expert",
    keywords: [["cardiology"], "cardiology intelligence"],
    topics: [
      "Core principles and best practices of Cardiology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  neurology_intelligence: {
    label: "Neurology Intelligence",
    role: "Specialized Neurology Intelligence Expert",
    keywords: [["neurology"], "neurology intelligence"],
    topics: [
      "Core principles and best practices of Neurology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  oncology_intelligence: {
    label: "Oncology Intelligence",
    role: "Specialized Oncology Intelligence Expert",
    keywords: [["oncology"], "oncology intelligence"],
    topics: [
      "Core principles and best practices of Oncology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  dermatology_intelligence: {
    label: "Dermatology Intelligence",
    role: "Specialized Dermatology Intelligence Expert",
    keywords: [["dermatology"], "dermatology intelligence"],
    topics: [
      "Core principles and best practices of Dermatology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  orthopedics_intelligence: {
    label: "Orthopedics Intelligence",
    role: "Specialized Orthopedics Intelligence Expert",
    keywords: [["orthopedics"], "orthopedics intelligence"],
    topics: [
      "Core principles and best practices of Orthopedics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  pediatrics_intelligence: {
    label: "Pediatrics Intelligence",
    role: "Specialized Pediatrics Intelligence Expert",
    keywords: [["pediatrics"], "pediatrics intelligence"],
    topics: [
      "Core principles and best practices of Pediatrics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  gynecology_intelligence: {
    label: "Gynecology Intelligence",
    role: "Specialized Gynecology Intelligence Expert",
    keywords: [["gynecology"], "gynecology intelligence"],
    topics: [
      "Core principles and best practices of Gynecology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  psychiatry_intelligence: {
    label: "Psychiatry Intelligence",
    role: "Specialized Psychiatry Intelligence Expert",
    keywords: [["psychiatry"], "psychiatry intelligence"],
    topics: [
      "Core principles and best practices of Psychiatry Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  radiology_intelligence: {
    label: "Radiology Intelligence",
    role: "Specialized Radiology Intelligence Expert",
    keywords: [["radiology"], "radiology intelligence"],
    topics: [
      "Core principles and best practices of Radiology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  pathology_intelligence: {
    label: "Pathology Intelligence",
    role: "Specialized Pathology Intelligence Expert",
    keywords: [["pathology"], "pathology intelligence"],
    topics: [
      "Core principles and best practices of Pathology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  criminal_law_intelligence: {
    label: "Criminal Law Intelligence",
    role: "Specialized Criminal Law Intelligence Expert",
    keywords: [["criminal","law"], "criminal law intelligence"],
    topics: [
      "Core principles and best practices of Criminal Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  civil_law_intelligence: {
    label: "Civil Law Intelligence",
    role: "Specialized Civil Law Intelligence Expert",
    keywords: [["civil","law"], "civil law intelligence"],
    topics: [
      "Core principles and best practices of Civil Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  corporate_law_intelligence: {
    label: "Corporate Law Intelligence",
    role: "Specialized Corporate Law Intelligence Expert",
    keywords: [["corporate","law"], "corporate law intelligence"],
    topics: [
      "Core principles and best practices of Corporate Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  intellectual_property_intelligence: {
    label: "Intellectual Property Intelligence",
    role: "Specialized Intellectual Property Intelligence Expert",
    keywords: [["intellectual","property"], "intellectual property intelligence"],
    topics: [
      "Core principles and best practices of Intellectual Property Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cyber_law_intelligence: {
    label: "Cyber Law Intelligence",
    role: "Specialized Cyber Law Intelligence Expert",
    keywords: [["cyber","law"], "cyber law intelligence"],
    topics: [
      "Core principles and best practices of Cyber Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  constitutional_law_intelligence: {
    label: "Constitutional Law Intelligence",
    role: "Specialized Constitutional Law Intelligence Expert",
    keywords: [["constitutional","law"], "constitutional law intelligence"],
    topics: [
      "Core principles and best practices of Constitutional Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  international_law_intelligence: {
    label: "International Law Intelligence",
    role: "Specialized International Law Intelligence Expert",
    keywords: [["international","law"], "international law intelligence"],
    topics: [
      "Core principles and best practices of International Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  contract_law_intelligence: {
    label: "Contract Law Intelligence",
    role: "Specialized Contract Law Intelligence Expert",
    keywords: [["contract","law"], "contract law intelligence"],
    topics: [
      "Core principles and best practices of Contract Law Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  system_design_intelligence: {
    label: "System Design Intelligence",
    role: "Specialized System Design Intelligence Expert",
    keywords: [["system","design"], "system design intelligence"],
    topics: [
      "Core principles and best practices of System Design Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  software_architecture_intelligence: {
    label: "Software Architecture Intelligence",
    role: "Specialized Software Architecture Intelligence Expert",
    keywords: [["software","architecture"], "software architecture intelligence"],
    topics: [
      "Core principles and best practices of Software Architecture Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  devops_intelligence: {
    label: "DevOps Intelligence",
    role: "Specialized DevOps Intelligence Expert",
    keywords: [["devops"], "devops intelligence"],
    topics: [
      "Core principles and best practices of DevOps Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  sre_intelligence: {
    label: "SRE Intelligence",
    role: "Specialized SRE Intelligence Expert",
    keywords: [["sre"], "sre intelligence"],
    topics: [
      "Core principles and best practices of SRE Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  database_engineering_intelligence: {
    label: "Database Engineering Intelligence",
    role: "Specialized Database Engineering Intelligence Expert",
    keywords: [["databaseering"], "database engineering intelligence"],
    topics: [
      "Core principles and best practices of Database Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  api_design_intelligence: {
    label: "API Design Intelligence",
    role: "Specialized API Design Intelligence Expert",
    keywords: [["api","design"], "api design intelligence"],
    topics: [
      "Core principles and best practices of API Design Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  mobile_app_engineering_intelligence: {
    label: "Mobile App Engineering Intelligence",
    role: "Specialized Mobile App Engineering Intelligence Expert",
    keywords: [["mobile","appering"], "mobile app engineering intelligence"],
    topics: [
      "Core principles and best practices of Mobile App Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  open_source_intelligence: {
    label: "Open Source Intelligence",
    role: "Specialized Open Source Intelligence Expert",
    keywords: [["open","source"], "open source intelligence"],
    topics: [
      "Core principles and best practices of Open Source Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  agentic_ai_intelligence: {
    label: "Agentic AI Intelligence",
    role: "Specialized Agentic AI Intelligence Expert",
    keywords: [["agentic","ai"], "agentic ai intelligence"],
    topics: [
      "Core principles and best practices of Agentic AI Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  multi_agent_intelligence: {
    label: "Multi-Agent Intelligence",
    role: "Specialized Multi-Agent Intelligence Expert",
    keywords: [["multi-agent"], "multi-agent intelligence"],
    topics: [
      "Core principles and best practices of Multi-Agent Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  rag_intelligence: {
    label: "RAG Intelligence",
    role: "Specialized RAG Intelligence Expert",
    keywords: [["rag"], "rag intelligence"],
    topics: [
      "Core principles and best practices of RAG Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  vector_database_intelligence: {
    label: "Vector Database Intelligence",
    role: "Specialized Vector Database Intelligence Expert",
    keywords: [["vector","database"], "vector database intelligence"],
    topics: [
      "Core principles and best practices of Vector Database Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  prompt_engineering_intelligence: {
    label: "Prompt Engineering Intelligence",
    role: "Specialized Prompt Engineering Intelligence Expert",
    keywords: [["promptering"], "prompt engineering intelligence"],
    topics: [
      "Core principles and best practices of Prompt Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ai_safety_intelligence: {
    label: "AI Safety Intelligence",
    role: "Specialized AI Safety Intelligence Expert",
    keywords: [["ai","safety"], "ai safety intelligence"],
    topics: [
      "Core principles and best practices of AI Safety Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  agi_research_intelligence: {
    label: "AGI Research Intelligence",
    role: "Specialized AGI Research Intelligence Expert",
    keywords: [["agi","research"], "agi research intelligence"],
    topics: [
      "Core principles and best practices of AGI Research Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ai_alignment_intelligence: {
    label: "AI Alignment Intelligence",
    role: "Specialized AI Alignment Intelligence Expert",
    keywords: [["ai","alignment"], "ai alignment intelligence"],
    topics: [
      "Core principles and best practices of AI Alignment Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  erp_intelligence: {
    label: "ERP Intelligence",
    role: "Specialized ERP Intelligence Expert",
    keywords: [["erp"], "erp intelligence"],
    topics: [
      "Core principles and best practices of ERP Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  sap_intelligence: {
    label: "SAP Intelligence",
    role: "Specialized SAP Intelligence Expert",
    keywords: [["sap"], "sap intelligence"],
    topics: [
      "Core principles and best practices of SAP Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  crm_intelligence: {
    label: "CRM Intelligence",
    role: "Specialized CRM Intelligence Expert",
    keywords: [["crm"], "crm intelligence"],
    topics: [
      "Core principles and best practices of CRM Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  salesforce_intelligence: {
    label: "Salesforce Intelligence",
    role: "Specialized Salesforce Intelligence Expert",
    keywords: [["salesforce"], "salesforce intelligence"],
    topics: [
      "Core principles and best practices of Salesforce Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  business_analytics_intelligence: {
    label: "Business Analytics Intelligence",
    role: "Specialized Business Analytics Intelligence Expert",
    keywords: [["business","analytics"], "business analytics intelligence"],
    topics: [
      "Core principles and best practices of Business Analytics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  data_engineering_intelligence: {
    label: "Data Engineering Intelligence",
    role: "Specialized Data Engineering Intelligence Expert",
    keywords: [["dataering"], "data engineering intelligence"],
    topics: [
      "Core principles and best practices of Data Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  data_governance_intelligence: {
    label: "Data Governance Intelligence",
    role: "Specialized Data Governance Intelligence Expert",
    keywords: [["data","governance"], "data governance intelligence"],
    topics: [
      "Core principles and best practices of Data Governance Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  lean_manufacturing_intelligence: {
    label: "Lean Manufacturing Intelligence",
    role: "Specialized Lean Manufacturing Intelligence Expert",
    keywords: [["lean","manufacturing"], "lean manufacturing intelligence"],
    topics: [
      "Core principles and best practices of Lean Manufacturing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  six_sigma_intelligence: {
    label: "Six Sigma Intelligence",
    role: "Specialized Six Sigma Intelligence Expert",
    keywords: [["six","sigma"], "six sigma intelligence"],
    topics: [
      "Core principles and best practices of Six Sigma Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  quality_assurance_intelligence: {
    label: "Quality Assurance Intelligence",
    role: "Specialized Quality Assurance Intelligence Expert",
    keywords: [["quality","assurance"], "quality assurance intelligence"],
    topics: [
      "Core principles and best practices of Quality Assurance Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  factory_automation_intelligence: {
    label: "Factory Automation Intelligence",
    role: "Specialized Factory Automation Intelligence Expert",
    keywords: [["factory","automation"], "factory automation intelligence"],
    topics: [
      "Core principles and best practices of Factory Automation Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  industrial_safety_intelligence: {
    label: "Industrial Safety Intelligence",
    role: "Specialized Industrial Safety Intelligence Expert",
    keywords: [["industrial","safety"], "industrial safety intelligence"],
    topics: [
      "Core principles and best practices of Industrial Safety Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  food_science_intelligence: {
    label: "Food Science Intelligence",
    role: "Specialized Food Science Intelligence Expert",
    keywords: [["food","science"], "food science intelligence"],
    topics: [
      "Core principles and best practices of Food Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  food_processing_intelligence: {
    label: "Food Processing Intelligence",
    role: "Specialized Food Processing Intelligence Expert",
    keywords: [["food","processing"], "food processing intelligence"],
    topics: [
      "Core principles and best practices of Food Processing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  food_safety_intelligence: {
    label: "Food Safety Intelligence",
    role: "Specialized Food Safety Intelligence Expert",
    keywords: [["food","safety"], "food safety intelligence"],
    topics: [
      "Core principles and best practices of Food Safety Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  restaurant_operations_intelligence: {
    label: "Restaurant Operations Intelligence",
    role: "Specialized Restaurant Operations Intelligence Expert",
    keywords: [["restaurant","operations"], "restaurant operations intelligence"],
    topics: [
      "Core principles and best practices of Restaurant Operations Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  hospitality_management_intelligence: {
    label: "Hospitality Management Intelligence",
    role: "Specialized Hospitality Management Intelligence Expert",
    keywords: [["hospitality","management"], "hospitality management intelligence"],
    topics: [
      "Core principles and best practices of Hospitality Management Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  interior_design_intelligence: {
    label: "Interior Design Intelligence",
    role: "Specialized Interior Design Intelligence Expert",
    keywords: [["interior","design"], "interior design intelligence"],
    topics: [
      "Core principles and best practices of Interior Design Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  home_automation_intelligence: {
    label: "Home Automation Intelligence",
    role: "Specialized Home Automation Intelligence Expert",
    keywords: [["home","automation"], "home automation intelligence"],
    topics: [
      "Core principles and best practices of Home Automation Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  smart_home_intelligence: {
    label: "Smart Home Intelligence",
    role: "Specialized Smart Home Intelligence Expert",
    keywords: [["smart","home"], "smart home intelligence"],
    topics: [
      "Core principles and best practices of Smart Home Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  home_security_intelligence: {
    label: "Home Security Intelligence",
    role: "Specialized Home Security Intelligence Expert",
    keywords: [["home","security"], "home security intelligence"],
    topics: [
      "Core principles and best practices of Home Security Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  home_finance_intelligence: {
    label: "Home Finance Intelligence",
    role: "Specialized Home Finance Intelligence Expert",
    keywords: [["home","finance"], "home finance intelligence"],
    topics: [
      "Core principles and best practices of Home Finance Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  geopolitics_intelligence: {
    label: "Geopolitics Intelligence",
    role: "Specialized Geopolitics Intelligence Expert",
    keywords: [["geopolitics"], "geopolitics intelligence"],
    topics: [
      "Core principles and best practices of Geopolitics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  strategic_affairs_intelligence: {
    label: "Strategic Affairs Intelligence",
    role: "Specialized Strategic Affairs Intelligence Expert",
    keywords: [["strategic","affairs"], "strategic affairs intelligence"],
    topics: [
      "Core principles and best practices of Strategic Affairs Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  international_relations_intelligence: {
    label: "International Relations Intelligence",
    role: "Specialized International Relations Intelligence Expert",
    keywords: [["international","relations"], "international relations intelligence"],
    topics: [
      "Core principles and best practices of International Relations Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  intelligence_studies: {
    label: "Intelligence Studies",
    role: "Specialized Intelligence Studies Expert",
    keywords: [["intelligence","studies"], "intelligence studies"],
    topics: [
      "Core principles and best practices of Intelligence Studies.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  security_studies: {
    label: "Security Studies",
    role: "Specialized Security Studies Expert",
    keywords: [["security","studies"], "security studies"],
    topics: [
      "Core principles and best practices of Security Studies.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  curriculum_design_intelligence: {
    label: "Curriculum Design Intelligence",
    role: "Specialized Curriculum Design Intelligence Expert",
    keywords: [["curriculum","design"], "curriculum design intelligence"],
    topics: [
      "Core principles and best practices of Curriculum Design Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  learning_science_intelligence: {
    label: "Learning Science Intelligence",
    role: "Specialized Learning Science Intelligence Expert",
    keywords: [["learning","science"], "learning science intelligence"],
    topics: [
      "Core principles and best practices of Learning Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  special_education_intelligence: {
    label: "Special Education Intelligence",
    role: "Specialized Special Education Intelligence Expert",
    keywords: [["special","education"], "special education intelligence"],
    topics: [
      "Core principles and best practices of Special Education Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  educational_psychology_intelligence: {
    label: "Educational Psychology Intelligence",
    role: "Specialized Educational Psychology Intelligence Expert",
    keywords: [["educational","psychology"], "educational psychology intelligence"],
    topics: [
      "Core principles and best practices of Educational Psychology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  edtech_intelligence: {
    label: "EdTech Intelligence",
    role: "Specialized EdTech Intelligence Expert",
    keywords: [["edtech"], "edtech intelligence"],
    topics: [
      "Core principles and best practices of EdTech Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  youtube_intelligence: {
    label: "YouTube Intelligence",
    role: "Specialized YouTube Intelligence Expert",
    keywords: [["youtube"], "youtube intelligence"],
    topics: [
      "Core principles and best practices of YouTube Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  instagram_intelligence: {
    label: "Instagram Intelligence",
    role: "Specialized Instagram Intelligence Expert",
    keywords: [["instagram"], "instagram intelligence"],
    topics: [
      "Core principles and best practices of Instagram Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  podcast_intelligence: {
    label: "Podcast Intelligence",
    role: "Specialized Podcast Intelligence Expert",
    keywords: [["podcast"], "podcast intelligence"],
    topics: [
      "Core principles and best practices of Podcast Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  newsletter_intelligence: {
    label: "Newsletter Intelligence",
    role: "Specialized Newsletter Intelligence Expert",
    keywords: [["newsletter"], "newsletter intelligence"],
    topics: [
      "Core principles and best practices of Newsletter Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  influencer_intelligence: {
    label: "Influencer Intelligence",
    role: "Specialized Influencer Intelligence Expert",
    keywords: [["influencer"], "influencer intelligence"],
    topics: [
      "Core principles and best practices of Influencer Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  creator_monetization_intelligence: {
    label: "Creator Monetization Intelligence",
    role: "Specialized Creator Monetization Intelligence Expert",
    keywords: [["creator","monetization"], "creator monetization intelligence"],
    topics: [
      "Core principles and best practices of Creator Monetization Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  space_missions_intelligence: {
    label: "Space Missions Intelligence",
    role: "Specialized Space Missions Intelligence Expert",
    keywords: [["space","missions"], "space missions intelligence"],
    topics: [
      "Core principles and best practices of Space Missions Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  rocket_science_intelligence: {
    label: "Rocket Science Intelligence",
    role: "Specialized Rocket Science Intelligence Expert",
    keywords: [["rocket","science"], "rocket science intelligence"],
    topics: [
      "Core principles and best practices of Rocket Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  satellite_intelligence: {
    label: "Satellite Intelligence",
    role: "Specialized Satellite Intelligence Expert",
    keywords: [["satellite"], "satellite intelligence"],
    topics: [
      "Core principles and best practices of Satellite Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  space_exploration_intelligence: {
    label: "Space Exploration Intelligence",
    role: "Specialized Space Exploration Intelligence Expert",
    keywords: [["space","exploration"], "space exploration intelligence"],
    topics: [
      "Core principles and best practices of Space Exploration Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  space_economy_intelligence: {
    label: "Space Economy Intelligence",
    role: "Specialized Space Economy Intelligence Expert",
    keywords: [["space","economy"], "space economy intelligence"],
    topics: [
      "Core principles and best practices of Space Economy Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  synthetic_biology_intelligence: {
    label: "Synthetic Biology Intelligence",
    role: "Specialized Synthetic Biology Intelligence Expert",
    keywords: [["synthetic","biology"], "synthetic biology intelligence"],
    topics: [
      "Core principles and best practices of Synthetic Biology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  bioinformatics_intelligence: {
    label: "Bioinformatics Intelligence",
    role: "Specialized Bioinformatics Intelligence Expert",
    keywords: [["bioinformatics"], "bioinformatics intelligence"],
    topics: [
      "Core principles and best practices of Bioinformatics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  nanotechnology_intelligence: {
    label: "Nanotechnology Intelligence",
    role: "Specialized Nanotechnology Intelligence Expert",
    keywords: [["nanotechnology"], "nanotechnology intelligence"],
    topics: [
      "Core principles and best practices of Nanotechnology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  materials_science_intelligence: {
    label: "Materials Science Intelligence",
    role: "Specialized Materials Science Intelligence Expert",
    keywords: [["materials","science"], "materials science intelligence"],
    topics: [
      "Core principles and best practices of Materials Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cognitive_science_intelligence: {
    label: "Cognitive Science Intelligence",
    role: "Specialized Cognitive Science Intelligence Expert",
    keywords: [["cognitive","science"], "cognitive science intelligence"],
    topics: [
      "Core principles and best practices of Cognitive Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cricket_intelligence: {
    label: "Cricket Intelligence",
    role: "Specialized Cricket Intelligence Expert",
    keywords: [["cricket"], "cricket intelligence"],
    topics: [
      "Core principles and best practices of Cricket Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  football_intelligence: {
    label: "Football Intelligence",
    role: "Specialized Football Intelligence Expert",
    keywords: [["football"], "football intelligence"],
    topics: [
      "Core principles and best practices of Football Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  tennis_intelligence: {
    label: "Tennis Intelligence",
    role: "Specialized Tennis Intelligence Expert",
    keywords: [["tennis"], "tennis intelligence"],
    topics: [
      "Core principles and best practices of Tennis Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  formula_1_intelligence: {
    label: "Formula 1 Intelligence",
    role: "Specialized Formula 1 Intelligence Expert",
    keywords: [["formula","1"], "formula 1 intelligence"],
    topics: [
      "Core principles and best practices of Formula 1 Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  olympic_sports_intelligence: {
    label: "Olympic Sports Intelligence",
    role: "Specialized Olympic Sports Intelligence Expert",
    keywords: [["olympic","sports"], "olympic sports intelligence"],
    topics: [
      "Core principles and best practices of Olympic Sports Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  sports_analytics_intelligence: {
    label: "Sports Analytics Intelligence",
    role: "Specialized Sports Analytics Intelligence Expert",
    keywords: [["sports","analytics"], "sports analytics intelligence"],
    topics: [
      "Core principles and best practices of Sports Analytics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  jewelry_intelligence: {
    label: "Jewelry Intelligence",
    role: "Specialized Jewelry Intelligence Expert",
    keywords: [["jewelry"], "jewelry intelligence"],
    topics: [
      "Core principles and best practices of Jewelry Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  watch_intelligence: {
    label: "Watch Intelligence",
    role: "Specialized Watch Intelligence Expert",
    keywords: [["watch"], "watch intelligence"],
    topics: [
      "Core principles and best practices of Watch Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  luxury_brand_intelligence: {
    label: "Luxury Brand Intelligence",
    role: "Specialized Luxury Brand Intelligence Expert",
    keywords: [["luxury","brand"], "luxury brand intelligence"],
    topics: [
      "Core principles and best practices of Luxury Brand Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  fashion_intelligence: {
    label: "Fashion Intelligence",
    role: "Specialized Fashion Intelligence Expert",
    keywords: [["fashion"], "fashion intelligence"],
    topics: [
      "Core principles and best practices of Fashion Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  beauty_intelligence: {
    label: "Beauty Intelligence",
    role: "Specialized Beauty Intelligence Expert",
    keywords: [["beauty"], "beauty intelligence"],
    topics: [
      "Core principles and best practices of Beauty Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  perfume_intelligence: {
    label: "Perfume Intelligence",
    role: "Specialized Perfume Intelligence Expert",
    keywords: [["perfume"], "perfume intelligence"],
    topics: [
      "Core principles and best practices of Perfume Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  life_planning_intelligence: {
    label: "Life Planning Intelligence",
    role: "Specialized Life Planning Intelligence Expert",
    keywords: [["life","planning"], "life planning intelligence"],
    topics: [
      "Core principles and best practices of Life Planning Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  goal_planning_intelligence: {
    label: "Goal Planning Intelligence",
    role: "Specialized Goal Planning Intelligence Expert",
    keywords: [["goal","planning"], "goal planning intelligence"],
    topics: [
      "Core principles and best practices of Goal Planning Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  decision_intelligence: {
    label: "Decision Intelligence",
    role: "Specialized Decision Intelligence Expert",
    keywords: [["decision"], "decision intelligence"],
    topics: [
      "Core principles and best practices of Decision Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  habit_building_intelligence: {
    label: "Habit Building Intelligence",
    role: "Specialized Habit Building Intelligence Expert",
    keywords: [["habit","building"], "habit building intelligence"],
    topics: [
      "Core principles and best practices of Habit Building Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  productivity_intelligence: {
    label: "Productivity Intelligence",
    role: "Specialized Productivity Intelligence Expert",
    keywords: [["productivity"], "productivity intelligence"],
    topics: [
      "Core principles and best practices of Productivity Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  time_management_intelligence: {
    label: "Time Management Intelligence",
    role: "Specialized Time Management Intelligence Expert",
    keywords: [["time","management"], "time management intelligence"],
    topics: [
      "Core principles and best practices of Time Management Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  personal_knowledge_management_intelligence: {
    label: "Personal Knowledge Management Intelligence",
    role: "Specialized Personal Knowledge Management Intelligence Expert",
    keywords: [["personal","knowledge","management"], "personal knowledge management intelligence"],
    topics: [
      "Core principles and best practices of Personal Knowledge Management Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  universal_research_engine: {
    label: "Universal Research Engine",
    role: "Specialized Universal Research Engine Expert",
    keywords: [["universal","research"], "universal research engine"],
    topics: [
      "Core principles and best practices of Universal Research Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  universal_search_engine: {
    label: "Universal Search Engine",
    role: "Specialized Universal Search Engine Expert",
    keywords: [["universal","search"], "universal search engine"],
    topics: [
      "Core principles and best practices of Universal Search Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  decision_intelligence_engine: {
    label: "Decision Intelligence Engine",
    role: "Specialized Decision Intelligence Engine Expert",
    keywords: [["decision"], "decision intelligence engine"],
    topics: [
      "Core principles and best practices of Decision Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  planning_intelligence_engine: {
    label: "Planning Intelligence Engine",
    role: "Specialized Planning Intelligence Engine Expert",
    keywords: [["planning"], "planning intelligence engine"],
    topics: [
      "Core principles and best practices of Planning Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  problem_solving_engine: {
    label: "Problem Solving Engine",
    role: "Specialized Problem Solving Engine Expert",
    keywords: [["problem","solving"], "problem solving engine"],
    topics: [
      "Core principles and best practices of Problem Solving Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  forecasting_intelligence_engine: {
    label: "Forecasting Intelligence Engine",
    role: "Specialized Forecasting Intelligence Engine Expert",
    keywords: [["forecasting"], "forecasting intelligence engine"],
    topics: [
      "Core principles and best practices of Forecasting Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  memory_intelligence_engine: {
    label: "Memory Intelligence Engine",
    role: "Specialized Memory Intelligence Engine Expert",
    keywords: [["memory"], "memory intelligence engine"],
    topics: [
      "Core principles and best practices of Memory Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  personality_intelligence_engine: {
    label: "Personality Intelligence Engine",
    role: "Specialized Personality Intelligence Engine Expert",
    keywords: [["personality"], "personality intelligence engine"],
    topics: [
      "Core principles and best practices of Personality Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  voice_intelligence_engine: {
    label: "Voice Intelligence Engine",
    role: "Specialized Voice Intelligence Engine Expert",
    keywords: [["voice"], "voice intelligence engine"],
    topics: [
      "Core principles and best practices of Voice Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  vision_intelligence_engine: {
    label: "Vision Intelligence Engine",
    role: "Specialized Vision Intelligence Engine Expert",
    keywords: [["vision"], "vision intelligence engine"],
    topics: [
      "Core principles and best practices of Vision Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  collaboration_intelligence_engine: {
    label: "Collaboration Intelligence Engine",
    role: "Specialized Collaboration Intelligence Engine Expert",
    keywords: [["collaboration"], "collaboration intelligence engine"],
    topics: [
      "Core principles and best practices of Collaboration Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  critical_thinking_engine: {
    label: "Critical Thinking Engine",
    role: "Specialized Critical Thinking Engine Expert",
    keywords: [["critical","thinking"], "critical thinking engine"],
    topics: [
      "Core principles and best practices of Critical Thinking Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  reasoning_engine: {
    label: "Reasoning Engine",
    role: "Specialized Reasoning Engine Expert",
    keywords: [["reasoning"], "reasoning engine"],
    topics: [
      "Core principles and best practices of Reasoning Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  scenario_simulation_engine: {
    label: "Scenario Simulation Engine",
    role: "Specialized Scenario Simulation Engine Expert",
    keywords: [["scenario","simulation"], "scenario simulation engine"],
    topics: [
      "Core principles and best practices of Scenario Simulation Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  risk_analysis_engine: {
    label: "Risk Analysis Engine",
    role: "Specialized Risk Analysis Engine Expert",
    keywords: [["risk","analysis"], "risk analysis engine"],
    topics: [
      "Core principles and best practices of Risk Analysis Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  life_management_engine: {
    label: "Life Management Engine",
    role: "Specialized Life Management Engine Expert",
    keywords: [["life","management"], "life management engine"],
    topics: [
      "Core principles and best practices of Life Management Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  personal_memory_engine: {
    label: "Personal Memory Engine",
    role: "Specialized Personal Memory Engine Expert",
    keywords: [["personal","memory"], "personal memory engine"],
    topics: [
      "Core principles and best practices of Personal Memory Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  goal_tracking_engine: {
    label: "Goal Tracking Engine",
    role: "Specialized Goal Tracking Engine Expert",
    keywords: [["goal","tracking"], "goal tracking engine"],
    topics: [
      "Core principles and best practices of Goal Tracking Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  life_timeline_engine: {
    label: "Life Timeline Engine",
    role: "Specialized Life Timeline Engine Expert",
    keywords: [["life","timeline"], "life timeline engine"],
    topics: [
      "Core principles and best practices of Life Timeline Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  achievement_tracking_engine: {
    label: "Achievement Tracking Engine",
    role: "Specialized Achievement Tracking Engine Expert",
    keywords: [["achievement","tracking"], "achievement tracking engine"],
    topics: [
      "Core principles and best practices of Achievement Tracking Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  personal_knowledge_base_engine: {
    label: "Personal Knowledge Base Engine",
    role: "Specialized Personal Knowledge Base Engine Expert",
    keywords: [["personal","knowledge","base"], "personal knowledge base engine"],
    topics: [
      "Core principles and best practices of Personal Knowledge Base Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  communication_intelligence: {
    label: "Communication Intelligence",
    role: "Specialized Communication Intelligence Expert",
    keywords: [["communication"], "communication intelligence"],
    topics: [
      "Core principles and best practices of Communication Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  negotiation_intelligence: {
    label: "Negotiation Intelligence",
    role: "Specialized Negotiation Intelligence Expert",
    keywords: [["negotiation"], "negotiation intelligence"],
    topics: [
      "Core principles and best practices of Negotiation Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  leadership_intelligence: {
    label: "Leadership Intelligence",
    role: "Specialized Leadership Intelligence Expert",
    keywords: [["leadership"], "leadership intelligence"],
    topics: [
      "Core principles and best practices of Leadership Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  public_speaking_intelligence: {
    label: "Public Speaking Intelligence",
    role: "Specialized Public Speaking Intelligence Expert",
    keywords: [["public","speaking"], "public speaking intelligence"],
    topics: [
      "Core principles and best practices of Public Speaking Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  emotional_intelligence: {
    label: "Emotional Intelligence",
    role: "Specialized Emotional Intelligence Expert",
    keywords: [["emotional"], "emotional intelligence"],
    topics: [
      "Core principles and best practices of Emotional Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  conflict_resolution_intelligence: {
    label: "Conflict Resolution Intelligence",
    role: "Specialized Conflict Resolution Intelligence Expert",
    keywords: [["conflict","resolution"], "conflict resolution intelligence"],
    topics: [
      "Core principles and best practices of Conflict Resolution Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  relationship_intelligence: {
    label: "Relationship Intelligence",
    role: "Specialized Relationship Intelligence Expert",
    keywords: [["relationship"], "relationship intelligence"],
    topics: [
      "Core principles and best practices of Relationship Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  workflow_automation_engine: {
    label: "Workflow Automation Engine",
    role: "Specialized Workflow Automation Engine Expert",
    keywords: [["workflow","automation"], "workflow automation engine"],
    topics: [
      "Core principles and best practices of Workflow Automation Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  business_process_intelligence: {
    label: "Business Process Intelligence",
    role: "Specialized Business Process Intelligence Expert",
    keywords: [["business","process"], "business process intelligence"],
    topics: [
      "Core principles and best practices of Business Process Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  knowledge_management_engine: {
    label: "Knowledge Management Engine",
    role: "Specialized Knowledge Management Engine Expert",
    keywords: [["knowledge","management"], "knowledge management engine"],
    topics: [
      "Core principles and best practices of Knowledge Management Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  document_management_engine: {
    label: "Document Management Engine",
    role: "Specialized Document Management Engine Expert",
    keywords: [["document","management"], "document management engine"],
    topics: [
      "Core principles and best practices of Document Management Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  enterprise_search_engine: {
    label: "Enterprise Search Engine",
    role: "Specialized Enterprise Search Engine Expert",
    keywords: [["enterprise","search"], "enterprise search engine"],
    topics: [
      "Core principles and best practices of Enterprise Search Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  meeting_intelligence_engine: {
    label: "Meeting Intelligence Engine",
    role: "Specialized Meeting Intelligence Engine Expert",
    keywords: [["meeting"], "meeting intelligence engine"],
    topics: [
      "Core principles and best practices of Meeting Intelligence Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  deep_research_engine: {
    label: "Deep Research Engine",
    role: "Specialized Deep Research Engine Expert",
    keywords: [["deep","research"], "deep research engine"],
    topics: [
      "Core principles and best practices of Deep Research Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  fact_verification_engine: {
    label: "Fact Verification Engine",
    role: "Specialized Fact Verification Engine Expert",
    keywords: [["fact","verification"], "fact verification engine"],
    topics: [
      "Core principles and best practices of Fact Verification Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  source_credibility_engine: {
    label: "Source Credibility Engine",
    role: "Specialized Source Credibility Engine Expert",
    keywords: [["source","credibility"], "source credibility engine"],
    topics: [
      "Core principles and best practices of Source Credibility Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  web_monitoring_engine: {
    label: "Web Monitoring Engine",
    role: "Specialized Web Monitoring Engine Expert",
    keywords: [["web","monitoring"], "web monitoring engine"],
    topics: [
      "Core principles and best practices of Web Monitoring Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  speech_intelligence: {
    label: "Speech Intelligence",
    role: "Specialized Speech Intelligence Expert",
    keywords: [["speech"], "speech intelligence"],
    topics: [
      "Core principles and best practices of Speech Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ocr_intelligence: {
    label: "OCR Intelligence",
    role: "Specialized OCR Intelligence Expert",
    keywords: [["ocr"], "ocr intelligence"],
    topics: [
      "Core principles and best practices of OCR Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  video_intelligence: {
    label: "Video Intelligence",
    role: "Specialized Video Intelligence Expert",
    keywords: [["video"], "video intelligence"],
    topics: [
      "Core principles and best practices of Video Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  audio_intelligence: {
    label: "Audio Intelligence",
    role: "Specialized Audio Intelligence Expert",
    keywords: [["audio"], "audio intelligence"],
    topics: [
      "Core principles and best practices of Audio Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ai_agent_builder: {
    label: "AI Agent Builder",
    role: "Specialized AI Agent Builder Expert",
    keywords: [["ai","agent","builder"], "ai agent builder"],
    topics: [
      "Core principles and best practices of AI Agent Builder.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  multi_agent_orchestrator: {
    label: "Multi-Agent Orchestrator",
    role: "Specialized Multi-Agent Orchestrator Expert",
    keywords: [["multi-agent","orchestrator"], "multi-agent orchestrator"],
    topics: [
      "Core principles and best practices of Multi-Agent Orchestrator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  tool_router_engine: {
    label: "Tool Router Engine",
    role: "Specialized Tool Router Engine Expert",
    keywords: [["tool","router"], "tool router engine"],
    topics: [
      "Core principles and best practices of Tool Router Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  workflow_agent_engine: {
    label: "Workflow Agent Engine",
    role: "Specialized Workflow Agent Engine Expert",
    keywords: [["workflow","agent"], "workflow agent engine"],
    topics: [
      "Core principles and best practices of Workflow Agent Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  autonomous_task_engine: {
    label: "Autonomous Task Engine",
    role: "Specialized Autonomous Task Engine Expert",
    keywords: [["autonomous","task"], "autonomous task engine"],
    topics: [
      "Core principles and best practices of Autonomous Task Engine.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  website_builder: {
    label: "Website Builder",
    role: "Specialized Website Builder Expert",
    keywords: [["website","builder"], "website builder"],
    topics: [
      "Core principles and best practices of Website Builder.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  app_builder: {
    label: "App Builder",
    role: "Specialized App Builder Expert",
    keywords: [["app","builder"], "app builder"],
    topics: [
      "Core principles and best practices of App Builder.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ui_generator: {
    label: "UI Generator",
    role: "Specialized UI Generator Expert",
    keywords: [["ui","generator"], "ui generator"],
    topics: [
      "Core principles and best practices of UI Generator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  logo_generator: {
    label: "Logo Generator",
    role: "Specialized Logo Generator Expert",
    keywords: [["logo","generator"], "logo generator"],
    topics: [
      "Core principles and best practices of Logo Generator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  presentation_generator: {
    label: "Presentation Generator",
    role: "Specialized Presentation Generator Expert",
    keywords: [["presentation","generator"], "presentation generator"],
    topics: [
      "Core principles and best practices of Presentation Generator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  video_generator: {
    label: "Video Generator",
    role: "Specialized Video Generator Expert",
    keywords: [["video","generator"], "video generator"],
    topics: [
      "Core principles and best practices of Video Generator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  image_generator: {
    label: "Image Generator",
    role: "Specialized Image Generator Expert",
    keywords: [["image","generator"], "image generator"],
    topics: [
      "Core principles and best practices of Image Generator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  resume_generator: {
    label: "Resume Generator",
    role: "Specialized Resume Generator Expert",
    keywords: [["resume","generator"], "resume generator"],
    topics: [
      "Core principles and best practices of Resume Generator.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  business_intelligence: {
    label: "Business Intelligence",
    role: "Specialized Business Intelligence Expert",
    keywords: [["business"], "business intelligence"],
    topics: [
      "Core principles and best practices of Business Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  market_intelligence: {
    label: "Market Intelligence",
    role: "Specialized Market Intelligence Expert",
    keywords: [["market"], "market intelligence"],
    topics: [
      "Core principles and best practices of Market Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  competitive_intelligence: {
    label: "Competitive Intelligence",
    role: "Specialized Competitive Intelligence Expert",
    keywords: [["competitive"], "competitive intelligence"],
    topics: [
      "Core principles and best practices of Competitive Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  consumer_intelligence: {
    label: "Consumer Intelligence",
    role: "Specialized Consumer Intelligence Expert",
    keywords: [["consumer"], "consumer intelligence"],
    topics: [
      "Core principles and best practices of Consumer Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  strategic_intelligence: {
    label: "Strategic Intelligence",
    role: "Specialized Strategic Intelligence Expert",
    keywords: [["strategic"], "strategic intelligence"],
    topics: [
      "Core principles and best practices of Strategic Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  quantum_computing_intelligence: {
    label: "Quantum Computing Intelligence",
    role: "Specialized Quantum Computing Intelligence Expert",
    keywords: [["quantum","computing"], "quantum computing intelligence"],
    topics: [
      "Core principles and best practices of Quantum Computing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  blockchain_intelligence: {
    label: "Blockchain Intelligence",
    role: "Specialized Blockchain Intelligence Expert",
    keywords: [["blockchain"], "blockchain intelligence"],
    topics: [
      "Core principles and best practices of Blockchain Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  veterinary_intelligence: {
    label: "Veterinary Intelligence",
    role: "Specialized Veterinary Intelligence Expert",
    keywords: [["veterinary"], "veterinary intelligence"],
    topics: [
      "Core principles and best practices of Veterinary Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  wildlife_intelligence: {
    label: "Wildlife Intelligence",
    role: "Specialized Wildlife Intelligence Expert",
    keywords: [["wildlife"], "wildlife intelligence"],
    topics: [
      "Core principles and best practices of Wildlife Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  sociology_intelligence: {
    label: "Sociology Intelligence",
    role: "Specialized Sociology Intelligence Expert",
    keywords: [["sociology"], "sociology intelligence"],
    topics: [
      "Core principles and best practices of Sociology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  anthropology_intelligence: {
    label: "Anthropology Intelligence",
    role: "Specialized Anthropology Intelligence Expert",
    keywords: [["anthropology"], "anthropology intelligence"],
    topics: [
      "Core principles and best practices of Anthropology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  child_development_intelligence: {
    label: "Child Development Intelligence",
    role: "Specialized Child Development Intelligence Expert",
    keywords: [["child","development"], "child development intelligence"],
    topics: [
      "Core principles and best practices of Child Development Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  aging_gerontology_intelligence: {
    label: "Aging & Gerontology Intelligence",
    role: "Specialized Aging & Gerontology Intelligence Expert",
    keywords: [["aging","&","gerontology"], "aging & gerontology intelligence"],
    topics: [
      "Core principles and best practices of Aging & Gerontology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  meditation_intelligence: {
    label: "Meditation Intelligence",
    role: "Specialized Meditation Intelligence Expert",
    keywords: [["meditation"], "meditation intelligence"],
    topics: [
      "Core principles and best practices of Meditation Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  microbiology_intelligence: {
    label: "Microbiology Intelligence",
    role: "Specialized Microbiology Intelligence Expert",
    keywords: [["microbiology"], "microbiology intelligence"],
    topics: [
      "Core principles and best practices of Microbiology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  immunology_intelligence: {
    label: "Immunology Intelligence",
    role: "Specialized Immunology Intelligence Expert",
    keywords: [["immunology"], "immunology intelligence"],
    topics: [
      "Core principles and best practices of Immunology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  clinical_research_intelligence: {
    label: "Clinical Research Intelligence",
    role: "Specialized Clinical Research Intelligence Expert",
    keywords: [["clinical","research"], "clinical research intelligence"],
    topics: [
      "Core principles and best practices of Clinical Research Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  genomics_intelligence: {
    label: "Genomics Intelligence",
    role: "Specialized Genomics Intelligence Expert",
    keywords: [["genomics"], "genomics intelligence"],
    topics: [
      "Core principles and best practices of Genomics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  anatomy_intelligence: {
    label: "Anatomy Intelligence",
    role: "Specialized Anatomy Intelligence Expert",
    keywords: [["anatomy"], "anatomy intelligence"],
    topics: [
      "Core principles and best practices of Anatomy Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  physiology_intelligence: {
    label: "Physiology Intelligence",
    role: "Specialized Physiology Intelligence Expert",
    keywords: [["physiology"], "physiology intelligence"],
    topics: [
      "Core principles and best practices of Physiology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  dentistry_intelligence: {
    label: "Dentistry Intelligence",
    role: "Specialized Dentistry Intelligence Expert",
    keywords: [["dentistry"], "dentistry intelligence"],
    topics: [
      "Core principles and best practices of Dentistry Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  ophthalmology_intelligence: {
    label: "Ophthalmology Intelligence",
    role: "Specialized Ophthalmology Intelligence Expert",
    keywords: [["ophthalmology"], "ophthalmology intelligence"],
    topics: [
      "Core principles and best practices of Ophthalmology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  meteorology_intelligence: {
    label: "Meteorology Intelligence",
    role: "Specialized Meteorology Intelligence Expert",
    keywords: [["meteorology"], "meteorology intelligence"],
    topics: [
      "Core principles and best practices of Meteorology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  disaster_management_intelligence: {
    label: "Disaster Management Intelligence",
    role: "Specialized Disaster Management Intelligence Expert",
    keywords: [["disaster","management"], "disaster management intelligence"],
    topics: [
      "Core principles and best practices of Disaster Management Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  hydrology_intelligence: {
    label: "Hydrology Intelligence",
    role: "Specialized Hydrology Intelligence Expert",
    keywords: [["hydrology"], "hydrology intelligence"],
    topics: [
      "Core principles and best practices of Hydrology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cartography_intelligence: {
    label: "Cartography Intelligence",
    role: "Specialized Cartography Intelligence Expert",
    keywords: [["cartography"], "cartography intelligence"],
    topics: [
      "Core principles and best practices of Cartography Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  glaciology_intelligence: {
    label: "Glaciology Intelligence",
    role: "Specialized Glaciology Intelligence Expert",
    keywords: [["glaciology"], "glaciology intelligence"],
    topics: [
      "Core principles and best practices of Glaciology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  desert_studies_intelligence: {
    label: "Desert Studies Intelligence",
    role: "Specialized Desert Studies Intelligence Expert",
    keywords: [["desert","studies"], "desert studies intelligence"],
    topics: [
      "Core principles and best practices of Desert Studies Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  game_development_intelligence: {
    label: "Game Development Intelligence",
    role: "Specialized Game Development Intelligence Expert",
    keywords: [["game","development"], "game development intelligence"],
    topics: [
      "Core principles and best practices of Game Development Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  game_design_intelligence: {
    label: "Game Design Intelligence",
    role: "Specialized Game Design Intelligence Expert",
    keywords: [["game","design"], "game design intelligence"],
    topics: [
      "Core principles and best practices of Game Design Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  esports_intelligence: {
    label: "Esports Intelligence",
    role: "Specialized Esports Intelligence Expert",
    keywords: [["esports"], "esports intelligence"],
    topics: [
      "Core principles and best practices of Esports Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  streaming_intelligence: {
    label: "Streaming Intelligence",
    role: "Specialized Streaming Intelligence Expert",
    keywords: [["streaming"], "streaming intelligence"],
    topics: [
      "Core principles and best practices of Streaming Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  web3_intelligence: {
    label: "Web3 Intelligence",
    role: "Specialized Web3 Intelligence Expert",
    keywords: [["web3"], "web3 intelligence"],
    topics: [
      "Core principles and best practices of Web3 Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  cryptocurrency_intelligence: {
    label: "Cryptocurrency Intelligence",
    role: "Specialized Cryptocurrency Intelligence Expert",
    keywords: [["cryptocurrency"], "cryptocurrency intelligence"],
    topics: [
      "Core principles and best practices of Cryptocurrency Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  mechanical_engineering_intelligence: {
    label: "Mechanical Engineering Intelligence",
    role: "Specialized Mechanical Engineering Intelligence Expert",
    keywords: [["mechanicalering"], "mechanical engineering intelligence"],
    topics: [
      "Core principles and best practices of Mechanical Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  civil_engineering_intelligence: {
    label: "Civil Engineering Intelligence",
    role: "Specialized Civil Engineering Intelligence Expert",
    keywords: [["civilering"], "civil engineering intelligence"],
    topics: [
      "Core principles and best practices of Civil Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  electrical_engineering_intelligence: {
    label: "Electrical Engineering Intelligence",
    role: "Specialized Electrical Engineering Intelligence Expert",
    keywords: [["electricalering"], "electrical engineering intelligence"],
    topics: [
      "Core principles and best practices of Electrical Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  electronics_engineering_intelligence: {
    label: "Electronics Engineering Intelligence",
    role: "Specialized Electronics Engineering Intelligence Expert",
    keywords: [["electronicsering"], "electronics engineering intelligence"],
    topics: [
      "Core principles and best practices of Electronics Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  industrial_engineering_intelligence: {
    label: "Industrial Engineering Intelligence",
    role: "Specialized Industrial Engineering Intelligence Expert",
    keywords: [["industrialering"], "industrial engineering intelligence"],
    topics: [
      "Core principles and best practices of Industrial Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  automobile_engineering_intelligence: {
    label: "Automobile Engineering Intelligence",
    role: "Specialized Automobile Engineering Intelligence Expert",
    keywords: [["automobileering"], "automobile engineering intelligence"],
    topics: [
      "Core principles and best practices of Automobile Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  aerospace_engineering_intelligence: {
    label: "Aerospace Engineering Intelligence",
    role: "Specialized Aerospace Engineering Intelligence Expert",
    keywords: [["aerospaceering"], "aerospace engineering intelligence"],
    topics: [
      "Core principles and best practices of Aerospace Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  marine_engineering_intelligence: {
    label: "Marine Engineering Intelligence",
    role: "Specialized Marine Engineering Intelligence Expert",
    keywords: [["marineering"], "marine engineering intelligence"],
    topics: [
      "Core principles and best practices of Marine Engineering Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  policing_intelligence: {
    label: "Policing Intelligence",
    role: "Specialized Policing Intelligence Expert",
    keywords: [["policing"], "policing intelligence"],
    topics: [
      "Core principles and best practices of Policing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  fire_safety_intelligence: {
    label: "Fire Safety Intelligence",
    role: "Specialized Fire Safety Intelligence Expert",
    keywords: [["fire","safety"], "fire safety intelligence"],
    topics: [
      "Core principles and best practices of Fire Safety Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  emergency_response_intelligence: {
    label: "Emergency Response Intelligence",
    role: "Specialized Emergency Response Intelligence Expert",
    keywords: [["emergency","response"], "emergency response intelligence"],
    topics: [
      "Core principles and best practices of Emergency Response Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  disaster_recovery_intelligence: {
    label: "Disaster Recovery Intelligence",
    role: "Specialized Disaster Recovery Intelligence Expert",
    keywords: [["disaster","recovery"], "disaster recovery intelligence"],
    topics: [
      "Core principles and best practices of Disaster Recovery Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  home_management_intelligence: {
    label: "Home Management Intelligence",
    role: "Specialized Home Management Intelligence Expert",
    keywords: [["home","management"], "home management intelligence"],
    topics: [
      "Core principles and best practices of Home Management Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  household_intelligence: {
    label: "Household Intelligence",
    role: "Specialized Household Intelligence Expert",
    keywords: [["household"], "household intelligence"],
    topics: [
      "Core principles and best practices of Household Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  personal_styling_intelligence: {
    label: "Personal Styling Intelligence",
    role: "Specialized Personal Styling Intelligence Expert",
    keywords: [["personal","styling"], "personal styling intelligence"],
    topics: [
      "Core principles and best practices of Personal Styling Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  skincare_intelligence: {
    label: "Skincare Intelligence",
    role: "Specialized Skincare Intelligence Expert",
    keywords: [["skincare"], "skincare intelligence"],
    topics: [
      "Core principles and best practices of Skincare Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  aquaculture_intelligence: {
    label: "Aquaculture Intelligence",
    role: "Specialized Aquaculture Intelligence Expert",
    keywords: [["aquaculture"], "aquaculture intelligence"],
    topics: [
      "Core principles and best practices of Aquaculture Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  equine_intelligence: {
    label: "Equine Intelligence",
    role: "Specialized Equine Intelligence Expert",
    keywords: [["equine"], "equine intelligence"],
    topics: [
      "Core principles and best practices of Equine Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  scientific_paper_intelligence: {
    label: "Scientific Paper Intelligence",
    role: "Specialized Scientific Paper Intelligence Expert",
    keywords: [["scientific","paper"], "scientific paper intelligence"],
    topics: [
      "Core principles and best practices of Scientific Paper Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  research_methodology_intelligence: {
    label: "Research Methodology Intelligence",
    role: "Specialized Research Methodology Intelligence Expert",
    keywords: [["research","methodology"], "research methodology intelligence"],
    topics: [
      "Core principles and best practices of Research Methodology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  survey_intelligence: {
    label: "Survey Intelligence",
    role: "Specialized Survey Intelligence Expert",
    keywords: [["survey"], "survey intelligence"],
    topics: [
      "Core principles and best practices of Survey Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  statistics_intelligence: {
    label: "Statistics Intelligence",
    role: "Specialized Statistics Intelligence Expert",
    keywords: [["statistics"], "statistics intelligence"],
    topics: [
      "Core principles and best practices of Statistics Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  creative_writing_intelligence: {
    label: "Creative Writing Intelligence",
    role: "Specialized Creative Writing Intelligence Expert",
    keywords: [["creative","writing"], "creative writing intelligence"],
    topics: [
      "Core principles and best practices of Creative Writing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  publishing_intelligence: {
    label: "Publishing Intelligence",
    role: "Specialized Publishing Intelligence Expert",
    keywords: [["publishing"], "publishing intelligence"],
    topics: [
      "Core principles and best practices of Publishing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  film_production_intelligence: {
    label: "Film Production Intelligence",
    role: "Specialized Film Production Intelligence Expert",
    keywords: [["film","production"], "film production intelligence"],
    topics: [
      "Core principles and best practices of Film Production Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  auditing_intelligence: {
    label: "Auditing Intelligence",
    role: "Specialized Auditing Intelligence Expert",
    keywords: [["auditing"], "auditing intelligence"],
    topics: [
      "Core principles and best practices of Auditing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  compliance_intelligence: {
    label: "Compliance Intelligence",
    role: "Specialized Compliance Intelligence Expert",
    keywords: [["compliance"], "compliance intelligence"],
    topics: [
      "Core principles and best practices of Compliance Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  museology_intelligence: {
    label: "Museology Intelligence",
    role: "Specialized Museology Intelligence Expert",
    keywords: [["museology"], "museology intelligence"],
    topics: [
      "Core principles and best practices of Museology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  library_science_intelligence: {
    label: "Library Science Intelligence",
    role: "Specialized Library Science Intelligence Expert",
    keywords: [["library","science"], "library science intelligence"],
    topics: [
      "Core principles and best practices of Library Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  archival_intelligence: {
    label: "Archival Intelligence",
    role: "Specialized Archival Intelligence Expert",
    keywords: [["archival"], "archival intelligence"],
    topics: [
      "Core principles and best practices of Archival Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  peace_conflict_studies_intelligence: {
    label: "Peace & Conflict Studies Intelligence",
    role: "Specialized Peace & Conflict Studies Intelligence Expert",
    keywords: [["peace","&","conflict","studies"], "peace & conflict studies intelligence"],
    topics: [
      "Core principles and best practices of Peace & Conflict Studies Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  heritage_management_intelligence: {
    label: "Heritage Management Intelligence",
    role: "Specialized Heritage Management Intelligence Expert",
    keywords: [["heritage","management"], "heritage management intelligence"],
    topics: [
      "Core principles and best practices of Heritage Management Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  marriage_intelligence: {
    label: "Marriage Intelligence",
    role: "Specialized Marriage Intelligence Expert",
    keywords: [["marriage"], "marriage intelligence"],
    topics: [
      "Core principles and best practices of Marriage Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  child_psychology_intelligence: {
    label: "Child Psychology Intelligence",
    role: "Specialized Child Psychology Intelligence Expert",
    keywords: [["child","psychology"], "child psychology intelligence"],
    topics: [
      "Core principles and best practices of Child Psychology Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  elder_care_intelligence: {
    label: "Elder Care Intelligence",
    role: "Specialized Elder Care Intelligence Expert",
    keywords: [["elder","care"], "elder care intelligence"],
    topics: [
      "Core principles and best practices of Elder Care Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  happiness_wellbeing_intelligence: {
    label: "Happiness & Wellbeing Intelligence",
    role: "Specialized Happiness & Wellbeing Intelligence Expert",
    keywords: [["happiness","&","wellbeing"], "happiness & wellbeing intelligence"],
    topics: [
      "Core principles and best practices of Happiness & Wellbeing Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  public_policy_intelligence: {
    label: "Public Policy Intelligence",
    role: "Specialized Public Policy Intelligence Expert",
    keywords: [["public","policy"], "public policy intelligence"],
    topics: [
      "Core principles and best practices of Public Policy Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  electoral_intelligence: {
    label: "Electoral Intelligence",
    role: "Specialized Electoral Intelligence Expert",
    keywords: [["electoral"], "electoral intelligence"],
    topics: [
      "Core principles and best practices of Electoral Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  operations_research_intelligence: {
    label: "Operations Research Intelligence",
    role: "Specialized Operations Research Intelligence Expert",
    keywords: [["operations","research"], "operations research intelligence"],
    topics: [
      "Core principles and best practices of Operations Research Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  literature_review_intelligence: {
    label: "Literature Review Intelligence",
    role: "Specialized Literature Review Intelligence Expert",
    keywords: [["literature","review"], "literature review intelligence"],
    topics: [
      "Core principles and best practices of Literature Review Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  experiment_design_intelligence: {
    label: "Experiment Design Intelligence",
    role: "Specialized Experiment Design Intelligence Expert",
    keywords: [["experiment","design"], "experiment design intelligence"],
    topics: [
      "Core principles and best practices of Experiment Design Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  performing_arts_intelligence: {
    label: "Performing Arts Intelligence",
    role: "Specialized Performing Arts Intelligence Expert",
    keywords: [["performing","arts"], "performing arts intelligence"],
    topics: [
      "Core principles and best practices of Performing Arts Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  tournament_intelligence: {
    label: "Tournament Intelligence",
    role: "Specialized Tournament Intelligence Expert",
    keywords: [["tournament"], "tournament intelligence"],
    topics: [
      "Core principles and best practices of Tournament Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  domain_hosting_intelligence: {
    label: "Domain & Hosting Intelligence",
    role: "Specialized Domain & Hosting Intelligence Expert",
    keywords: [["domain","&","hosting"], "domain & hosting intelligence"],
    topics: [
      "Core principles and best practices of Domain & Hosting Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  networking_intelligence: {
    label: "Networking Intelligence",
    role: "Specialized Networking Intelligence Expert",
    keywords: [["networking"], "networking intelligence"],
    topics: [
      "Core principles and best practices of Networking Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  isp_intelligence: {
    label: "ISP Intelligence",
    role: "Specialized ISP Intelligence Expert",
    keywords: [["isp"], "isp intelligence"],
    topics: [
      "Core principles and best practices of ISP Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  climate_science_intelligence: {
    label: "Climate Science Intelligence",
    role: "Specialized Climate Science Intelligence Expert",
    keywords: [["climate","science"], "climate science intelligence"],
    topics: [
      "Core principles and best practices of Climate Science Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  fisheries_intelligence: {
    label: "Fisheries Intelligence",
    role: "Specialized Fisheries Intelligence Expert",
    keywords: [["fisheries"], "fisheries intelligence"],
    topics: [
      "Core principles and best practices of Fisheries Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  apiculture_intelligence: {
    label: "Apiculture Intelligence",
    role: "Specialized Apiculture Intelligence Expert",
    keywords: [["apiculture"], "apiculture intelligence"],
    topics: [
      "Core principles and best practices of Apiculture Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  space_colonization_intelligence: {
    label: "Space Colonization Intelligence",
    role: "Specialized Space Colonization Intelligence Expert",
    keywords: [["space","colonization"], "space colonization intelligence"],
    topics: [
      "Core principles and best practices of Space Colonization Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  },

  human_augmentation_intelligence: {
    label: "Human Augmentation Intelligence",
    role: "Specialized Human Augmentation Intelligence Expert",
    keywords: [["human","augmentation"], "human augmentation intelligence"],
    topics: [
      "Core principles and best practices of Human Augmentation Intelligence.",
      "Advanced problem solving and domain-specific heuristics."
    ]
  }
};

module.exports = nicheRegistry;
