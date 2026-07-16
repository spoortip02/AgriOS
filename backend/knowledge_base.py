# Agricultural knowledge base for AgriOS
# USA-focused, covering top crops: Corn, Soybean, Tomato, Wheat, Apple

KNOWLEDGE_BASE = [
    # ==================== CORN DISEASES ====================
    {
        "id": "corn-gray-leaf-spot",
        "text": "Corn Gray Leaf Spot: Caused by Cercospora zeae-maydis fungus. Symptoms include rectangular tan to gray lesions on leaves, parallel to leaf veins. Weather triggers: temperatures 22-30°C with humidity above 90% for extended periods. Treatment: Apply azoxystrobin or propiconazole fungicide at 1L/hectare. Best applied at VT stage (tasseling). Rotate crops with soybean to reduce inoculum. Pre-harvest interval: 30 days.",
        "category": "disease",
        "crop": "corn",
        "type": "fungal"
    },
    {
        "id": "corn-common-rust",
        "text": "Corn Common Rust: Caused by Puccinia sorghi fungus. Symptoms include small, circular to elongated cinnamon-brown pustules on both leaf surfaces. Weather triggers: cool temperatures 15-20°C with high humidity and heavy dew. Treatment: Apply mancozeb at 2kg/hectare or trifloxystrobin at early infection stage. Plant resistant hybrids for prevention. Economic threshold: more than 5% leaf area affected before tasseling.",
        "category": "disease",
        "crop": "corn",
        "type": "fungal"
    },
    {
        "id": "corn-northern-leaf-blight",
        "text": "Corn Northern Leaf Blight: Caused by Setosphaeria turcica fungus. Symptoms include long cigar-shaped gray-green to tan lesions 2.5-15cm long on leaves. Weather triggers: moderate temperatures 18-27°C with prolonged leaf wetness above 6 hours. Treatment: Apply propiconazole at 0.5L/hectare at VT stage. Crop rotation with non-host crops reduces disease pressure. Yield losses up to 50% in severe cases.",
        "category": "disease",
        "crop": "corn",
        "type": "fungal"
    },
    {
        "id": "corn-planting",
        "text": "Corn Planting Guide USA: Optimal soil temperature 10-13°C minimum for germination, ideal 18-24°C. Plant after last frost date. Northern states (Iowa, Illinois): May 1-15. Southern states (Georgia, Texas): March 15 - April 15. Soil pH optimal 6.0-6.8. Nitrogen requirement 150-200 lbs/acre split application. Potassium 100-120 lbs/acre. Phosphorus 80-100 lbs/acre. Plant spacing 20-25cm within row, 75cm between rows. Water requirement 500-800mm per season.",
        "category": "planting",
        "crop": "corn",
        "type": "planning"
    },
    {
        "id": "corn-irrigation",
        "text": "Corn Irrigation Requirements: Critical water periods are VT (tasseling) and R1 (silking) stages — water stress here causes 8% yield loss per day. Sandy soils need irrigation every 3-4 days, loam every 5-7 days, clay every 7-10 days. Drip irrigation efficiency 90%, sprinkler 75%, flood 60%. Daily water use at peak: 8-10mm/day. Total seasonal requirement: 500-750mm. Deficit irrigation below 80% of ETc causes significant yield loss.",
        "category": "irrigation",
        "crop": "corn",
        "type": "water_management"
    },

    # ==================== TOMATO DISEASES ====================
    {
        "id": "tomato-late-blight",
        "text": "Tomato Late Blight: Caused by Phytophthora infestans oomycete. Symptoms include water-soaked gray-green lesions on leaves that turn brown, white fuzzy growth on leaf undersides, brown firm rot on fruits. Weather triggers: humidity above 90% and temperatures 10-24°C for 2 consecutive days — use BLITECAST model for forecasting. Treatment: Apply chlorothalonil at 1.5kg/hectare every 7 days preventively. Copper hydroxide 2.5kg/hectare for organic production. Remove and destroy infected plants immediately. Pre-harvest interval chlorothalonil: 7 days.",
        "category": "disease",
        "crop": "tomato",
        "type": "oomycete"
    },
    {
        "id": "tomato-early-blight",
        "text": "Tomato Early Blight: Caused by Alternaria solani fungus. Symptoms include dark brown lesions with concentric rings (target-board pattern) on older lower leaves first, yellow halo around lesions. Weather triggers: warm temperatures 24-29°C with leaf wetness periods above 2 hours, high nitrogen deficiency increases susceptibility. Treatment: Apply mancozeb at 2kg/hectare or azoxystrobin at 1L/hectare every 7-10 days. Remove lower infected leaves. Mulch to prevent soil splash. Pre-harvest interval mancozeb: 5 days.",
        "category": "disease",
        "crop": "tomato",
        "type": "fungal"
    },
    {
        "id": "tomato-bacterial-spot",
        "text": "Tomato Bacterial Spot: Caused by Xanthomonas vesicatoria bacteria. Symptoms include small water-soaked circular spots on leaves turning brown with yellow halo, raised scab-like spots on fruits reducing market value. Weather triggers: warm rainy weather 24-30°C, spread by rain splash and wind. Treatment: Apply copper hydroxide at 2.5kg/hectare combined with mancozeb for resistance management. Avoid overhead irrigation. Use disease-free certified seed. Pre-harvest interval copper: 0 days.",
        "category": "disease",
        "crop": "tomato",
        "type": "bacterial"
    },
    {
        "id": "tomato-septoria-leaf-spot",
        "text": "Tomato Septoria Leaf Spot: Caused by Septoria lycopersici fungus. Symptoms include circular spots with dark brown borders and gray-white centers with tiny black dots (pycnidia) on lower leaves spreading upward. Weather triggers: warm wet conditions 20-25°C, prolonged leaf wetness. Treatment: Apply chlorothalonil at 1.5kg/hectare every 7-10 days. Remove infected lower leaves. Stake plants for air circulation. Avoid working in fields when wet. Pre-harvest interval: 7 days.",
        "category": "disease",
        "crop": "tomato",
        "type": "fungal"
    },
    {
        "id": "tomato-planting",
        "text": "Tomato Planting Guide USA: Transplant after last frost, soil temperature minimum 16°C. Northern states: June 1-15. Southern states: February-March. Optimal soil pH 6.2-6.8. Nitrogen 150-200 lbs/acre in split applications. Phosphorus 100 lbs/acre at planting. Potassium 150-200 lbs/acre. Calcium critical for blossom end rot prevention — apply gypsum 500kg/hectare. Plant spacing 45-60cm within row, 120-150cm between rows. Staking or caging required for indeterminate varieties.",
        "category": "planting",
        "crop": "tomato",
        "type": "planning"
    },

    # ==================== SOYBEAN DISEASES ====================
    {
        "id": "soybean-sudden-death",
        "text": "Soybean Sudden Death Syndrome (SDS): Caused by Fusarium virguliforme fungus. Symptoms include interveinal chlorosis and necrosis on leaves while roots show internal blue-gray rot. Weather triggers: cool wet soils at planting below 15°C, compacted soils increase severity. Treatment: Seed treatment with fluopyram or metalaxyl before planting. No effective foliar fungicide — prevention is key. Avoid early planting in cool wet soils. Drain compacted fields. Yield losses 10-30% in severe outbreaks.",
        "category": "disease",
        "crop": "soybean",
        "type": "fungal"
    },
    {
        "id": "soybean-planting",
        "text": "Soybean Planting Guide USA: Plant when soil temperature reaches 10°C minimum, optimal 15-18°C. Corn Belt states: May 1-20. Southern states: April 1-15. Optimal soil pH 6.0-6.8. Inoculate with Bradyrhizobium japonicum if no previous soybean history. Phosphorus 80-100 lbs/acre. Potassium 100-120 lbs/acre. Nitrogen usually unnecessary due to nitrogen fixation. Row spacing 38-76cm. Seeding rate 250,000-350,000 seeds/acre. Water requirement 450-700mm per season.",
        "category": "planting",
        "crop": "soybean",
        "type": "planning"
    },

    # ==================== WHEAT DISEASES ====================
    {
        "id": "wheat-stripe-rust",
        "text": "Wheat Stripe Rust: Caused by Puccinia striiformis fungus. Symptoms include yellow-orange pustules arranged in stripes parallel to leaf veins, severely reduces photosynthesis. Weather triggers: cool temperatures 10-15°C with heavy dew or light rain — most damaging in Pacific Northwest and Great Plains. Treatment: Apply propiconazole at 0.5L/hectare or tebuconazole at Feekes 8-10 growth stage. Scout weekly during spring. Economic threshold: any stripe rust present at flag leaf stage warrants treatment.",
        "category": "disease",
        "crop": "wheat",
        "type": "fungal"
    },
    {
        "id": "wheat-planting",
        "text": "Wheat Planting Guide USA: Winter wheat planted September-November, harvested June-July. Spring wheat planted March-April, harvested August. Optimal soil pH 6.0-7.0. Nitrogen 100-150 lbs/acre split — 30% at planting, 70% at green-up. Phosphorus 60-80 lbs/acre. Potassium 60-80 lbs/acre. Seeding rate 90-135 lbs/acre. Row spacing 15-18cm. Water requirement 400-500mm per season. Vernalization requirement for winter wheat: 6-8 weeks below 5°C.",
        "category": "planting",
        "crop": "wheat",
        "type": "planning"
    },

    # ==================== APPLE DISEASES ====================
    {
        "id": "apple-scab",
        "text": "Apple Scab: Caused by Venturia inaequalis fungus. Symptoms include olive-green to brown velvety lesions on leaves and fruits, severely reduces fruit marketability. Weather triggers: temperatures 6-24°C with leaf wetness — use Mills Table: at 16°C requires 9 hours leaf wetness for infection. Treatment: Apply captan at 2.5kg/hectare or myclobutanil at 0.5L/hectare. Begin applications at green tip stage and continue every 7-14 days. Pre-harvest interval captan: 7 days. Economic impact: can cause 70% crop loss without management.",
        "category": "disease",
        "crop": "apple",
        "type": "fungal"
    },
    {
        "id": "apple-cedar-rust",
        "text": "Apple Cedar Rust: Caused by Gymnosporangium juniperi-virginianae fungus. Symptoms include bright orange-yellow spots on upper leaf surface with tube-like structures on leaf undersides. Requires both apple and eastern red cedar as hosts. Weather triggers: wet spring weather during bloom, spores release from cedar galls when temperatures exceed 10°C. Treatment: Apply myclobutanil at 0.5L/hectare from pink stage through second cover spray. Remove nearby cedar trees within 300 meters. Pre-harvest interval: 7 days.",
        "category": "disease",
        "crop": "apple",
        "type": "fungal"
    },
    {
        "id": "apple-planting",
        "text": "Apple Orchard Planning USA: Site selection: well-drained loam soil, pH 6.0-7.0, avoid frost pockets. Chilling hours requirement: 800-1200 hours below 7°C depending on variety. Spacing: standard rootstock 9x9m, dwarf rootstock 1.5x4.5m. Nitrogen 50-80 lbs/acre mature orchard split applications. Calcium sprays critical — apply calcium chloride 4 times per season for bitter pit prevention. Water requirement 750-1000mm per season. Training systems: central leader for dwarf, modified leader for standard.",
        "category": "planting",
        "crop": "apple",
        "type": "planning"
    },

    # ==================== IPM PROTOCOLS ====================
    {
        "id": "ipm-fungal-general",
        "text": "Integrated Pest Management for Fungal Diseases USA: Biological controls include Bacillus subtilis (Serenade) effective against many fungal pathogens at 4-6L/hectare. Cultural controls: crop rotation minimum 2 years non-host crop, remove crop debris after harvest, improve drainage, maintain plant spacing for air circulation. Chemical rotation to prevent resistance: rotate between FRAC groups 3 (DMI fungicides), 7 (SDHI), 11 (QoI/strobilurins), 29 (phenylpyrroles). Never use same FRAC group consecutively.",
        "category": "ipm",
        "crop": "general",
        "type": "protocol"
    },
    {
        "id": "ipm-bacterial-general",
        "text": "Integrated Pest Management for Bacterial Diseases USA: No curative chemical treatments for bacterial diseases — prevention is critical. Copper-based bactericides (copper hydroxide, copper sulfate) are primary tools at 2-3kg/hectare. Avoid overhead irrigation — use drip irrigation to reduce leaf wetness. Sanitize equipment with 10% bleach solution between fields. Use certified disease-free seed. Biological control: Bacillus amyloliquefaciens strain D747 shows promise. Scout regularly and remove infected plant material immediately.",
        "category": "ipm",
        "crop": "general",
        "type": "protocol"
    },

    # ==================== WEATHER RISK RULES ====================
    {
        "id": "weather-fungal-risk",
        "text": "Weather-Based Fungal Disease Risk Rules USA: HIGH RISK conditions: relative humidity above 80% for more than 10 consecutive hours combined with temperatures between 15-30°C. Apply preventive fungicide within 24 hours. MEDIUM RISK: humidity 60-80% with warm temperatures — scout every 3 days. LOW RISK: humidity below 60% or temperatures outside 10-35°C range. Dew point above 15°C with morning temperatures increasing indicates high infection risk. Rain events followed by warm humid conditions: spray within 12 hours.",
        "category": "weather_risk",
        "crop": "general",
        "type": "risk_rules"
    },
    {
        "id": "weather-irrigation-triggers",
        "text": "Weather-Based Irrigation Triggers USA: Irrigate when soil moisture drops below 50% field capacity for most crops. Evapotranspiration (ET) based scheduling: replace 100% of ET daily for high-value crops. Stress indicators: leaf rolling before 10am indicates severe stress requiring immediate irrigation. Rain forecast above 15mm within 24 hours: skip scheduled irrigation. Temperature above 35°C with low humidity: increase irrigation frequency by 30%. Wind above 20km/h: avoid sprinkler irrigation due to evaporation losses exceeding 30%.",
        "category": "weather_risk",
        "crop": "general",
        "type": "irrigation_rules"
    },

    # ==================== SOIL NUTRIENTS ====================
    {
        "id": "soil-nutrients-general",
        "text": "Soil Nutrient Management USA Crops: Optimal soil pH ranges: corn 6.0-6.8, soybean 6.0-6.8, tomato 6.2-6.8, wheat 6.0-7.0, apple 6.0-7.0. Nitrogen deficiency symptoms: yellowing starting from lower leaves moving upward, V-shaped yellow pattern on corn leaves. Phosphorus deficiency: purple coloration on leaves and stems, stunted root development. Potassium deficiency: marginal leaf scorch starting on lower leaves. Calcium deficiency: blossom end rot in tomato, bitter pit in apple, tip burn in lettuce. Apply lime to raise pH: 2-3 tons/acre for each unit pH increase needed.",
        "category": "soil",
        "crop": "general",
        "type": "nutrients"
    }
]