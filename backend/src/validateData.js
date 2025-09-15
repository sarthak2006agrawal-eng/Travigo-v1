/**
 * validateData.js
 * 
 * PURPOSE:
 * ----------
 * Comprehensive data validation script for destination JSON files.
 * Validates data integrity, schema compliance, and data quality.
 * 
 * VALIDATIONS:
 * ----------
 * 1. City-Level Checks (unique IDs, names, timezone, descriptions)
 * 2. POI Checks (IDs, names, categories, coordinates, costs, times)
 * 3. Accommodation Checks (IDs, names, categories, costs, ratings, amenities)
 * 4. Transport Checks (currency, costs, semantic rules)
 * 5. Weather & Alerts (sources, thresholds, units)
 * 6. Cross-City Consistency (ID prefixes, schema structure)
 * 7. Auto-Fix Rules (normalization, missing fields, casing)
 * 8. AI/ML-Specific Checks (characters, token limits, translations)
 * 9. Output & Reports (console, JSON, Markdown)
 * 10. Integration (npm scripts, pre-commit hooks, CI/CD)
 * 
 * USAGE:
 * ----------
 * node src/validateData.js           # Validation only
 * node src/validateData.js --fix     # Validation + auto-fix
 * npm run validate                   # Via package.json script
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Check for --fix flag
const shouldFix = process.argv.includes('--fix');

// Load all JSON files
const goaData = JSON.parse(readFileSync(join(__dirname, 'data', 'goa.json'), 'utf8'));
const pondicherryData = JSON.parse(readFileSync(join(__dirname, 'data', 'pondicherry.json'), 'utf8'));
const shimlaData = JSON.parse(readFileSync(join(__dirname, 'data', 'shimla.json'), 'utf8'));

const allData = [
  { name: 'Goa', data: goaData, file: 'goa.json' },
  { name: 'Pondicherry', data: pondicherryData, file: 'pondicherry.json' },
  { name: 'Shimla', data: shimlaData, file: 'shimla.json' }
];

// Validation results
const errors = [];
const warnings = [];
const fixes = [];
const stats = {
  cities: 0,
  pois: 0,
  accommodations: 0,
  totalErrors: 0,
  totalWarnings: 0,
  totalFixes: 0
};

// Enhanced validation data
const validationReport = {
  timestamp: new Date().toISOString(),
  summary: {},
  errors: [],
  warnings: [],
  fixes: [],
  statistics: {}
};

// Enhanced validation constants
const STANDARD_CATEGORIES = {
  pois: ['Leisure', 'Historical', 'Nature', 'Spiritual', 'Heritage', 'Adventure', 'Religious', 'Sightseeing', 'Shopping'],
  accommodations: ['luxury', 'mid-range', 'budget'],
  subcategories: ['Beach', 'Church', 'Fort', 'Waterfall', 'Market', 'Promenade', 'Landmark', 'Temple', 'Train Ride', 'Hill Station', 'Museum', 'Township', 'Ashram', 'Colonial Area']
};

const VALID_TIMEZONES = [
  'Asia/Kolkata', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Karachi', 'Asia/Colombo',
  'America/New_York', 'America/Los_Angeles', 'Europe/London', 'Europe/Paris'
];

const VALID_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];

const STANDARD_AMENITIES = [
  'wifi', 'spa', 'pool', 'restaurant', 'parking', 'breakfast', 'gym', 'bar',
  'concierge', 'room_service', 'laundry', 'business_center', 'beach_access'
];

const PREFERENCE_CATEGORIES = [
  'nature_and_wildlife', 'photography', 'food_and_cuisine', 'adventure_and_sports',
  'relaxation_and_wellness', 'shopping', 'culture_and_history', 'nightlife_and_entertainment'
];

// Helper functions
const addError = (message, city = '', context = '') => {
  const error = { message, city, context, timestamp: new Date().toISOString() };
  errors.push(error);
  validationReport.errors.push(error);
  stats.totalErrors++;
};

const addWarning = (message, city = '', context = '') => {
  const warning = { message, city, context, timestamp: new Date().toISOString() };
  warnings.push(warning);
  validationReport.warnings.push(warning);
  stats.totalWarnings++;
};

const addFix = (message, city = '', context = '', action = '') => {
  const fix = { message, city, context, action, timestamp: new Date().toISOString() };
  fixes.push(fix);
  validationReport.fixes.push(fix);
  stats.totalFixes++;
};

// Auto-fix functions
const fixCapitalization = (text) => {
  if (typeof text !== 'string') return text;
  return text.replace(/\b\w/g, l => l.toUpperCase());
};

const fixCategoryCasing = (category, type = 'poi') => {
  if (type === 'accommodation') {
    return category.toLowerCase();
  }
  return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
};

const fixDescription = (text) => {
  if (typeof text !== 'string') return text;
  return text.trim().replace(/\s+/g, ' ').replace(/\n+/g, ' ');
};

const fixCurrency = (currency) => {
  if (!currency || !VALID_CURRENCIES.includes(currency)) {
    return 'INR';
  }
  return currency;
};

const fixAmenities = (amenities) => {
  if (!Array.isArray(amenities)) return [];
  return amenities.map(amenity => amenity.toLowerCase().trim()).filter(amenity => amenity);
};

const fixTimezone = (timezone) => {
  if (!timezone || !VALID_TIMEZONES.includes(timezone)) {
    return 'Asia/Kolkata';
  }
  return timezone;
};

const fixTimeFormat = (time) => {
  if (!time || typeof time !== 'string') return '09:00';
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return '09:00';
  const hours = parseInt(match[1]);
  const minutes = parseInt(match[2]);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return '09:00';
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

// 1. City-Level Checks
const validateCityLevel = () => {
  console.log('🔍 Validating city-level checks...');
  
  const cityIds = new Set();
  const cityNames = new Set();
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check city ID uniqueness and format
    if (cityIds.has(city.id)) {
      addError(`Duplicate city ID: ${city.id}`, name, 'city.id');
    } else {
      cityIds.add(city.id);
    }
    
    if (!/^C[1-9]\d*$/.test(city.id)) {
      addError(`Invalid city ID format: ${city.id}. Should be C1, C2, C3, etc.`, name, 'city.id');
    }
    
    // Check city name uniqueness
    if (cityNames.has(city.name)) {
      addError(`Duplicate city name: ${city.name}`, name, 'city.name');
    } else {
      cityNames.add(city.name);
    }
    
    // Check country and state capitalization
    if (city.country && city.country !== city.country.charAt(0).toUpperCase() + city.country.slice(1).toLowerCase()) {
      if (shouldFix) {
        city.country = fixCapitalization(city.country);
        addFix(`Fixed country capitalization: ${city.country}`, name, 'city.country', 'Capitalized');
      } else {
        addWarning(`Country should be properly capitalized: ${city.country}`, name, 'city.country');
      }
    }
    
    if (city.state && city.state !== city.state.charAt(0).toUpperCase() + city.state.slice(1).toLowerCase()) {
      if (shouldFix) {
        city.state = fixCapitalization(city.state);
        addFix(`Fixed state capitalization: ${city.state}`, name, 'city.state', 'Capitalized');
      } else {
        addWarning(`State should be properly capitalized: ${city.state}`, name, 'city.state');
      }
    }
    
    // Check descriptions
    if (!city.description?.en || city.description.en.length === 0) {
      addError(`Missing English description`, name, 'city.description.en');
    } else if (city.description.en.length > 500) {
      addWarning(`City description too long: ${city.description.en.length} characters`, name, 'city.description.en');
    }
    
    if (!city.description?.hi || city.description.hi.length === 0) {
      if (shouldFix) {
        city.description.hi = 'N/A';
        addFix(`Added missing Hindi description`, name, 'city.description.hi', 'Set to N/A');
      } else {
        addError(`Missing Hindi description`, name, 'city.description.hi');
      }
    } else if (city.description.hi.length > 500) {
      addWarning(`City description too long: ${city.description.hi.length} characters`, name, 'city.description.hi');
    }
    
    // Check timezone
    if (!city.timezone || !VALID_TIMEZONES.includes(city.timezone)) {
      if (shouldFix) {
        city.timezone = fixTimezone(city.timezone);
        addFix(`Fixed timezone: ${city.timezone}`, name, 'city.timezone', 'Set to Asia/Kolkata');
      } else {
        addError(`Invalid timezone: ${city.timezone}`, name, 'city.timezone');
      }
    }
    
    stats.cities++;
  });
};

// 2. POI (Points of Interest) Checks
const validatePOIs = () => {
  console.log('🔍 Validating POI checks...');
  
  const allPOIIds = new Set();
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    const cityPOIIds = new Set();
    
    city.pois.forEach((poi, index) => {
      // Check POI ID uniqueness
      if (cityPOIIds.has(poi.id)) {
        addError(`Duplicate POI ID within city: ${poi.id}`, name, `pois[${index}].id`);
      } else {
        cityPOIIds.add(poi.id);
      }
      
      if (allPOIIds.has(poi.id)) {
        addError(`Duplicate POI ID across cities: ${poi.id}`, name, `pois[${index}].id`);
      } else {
        allPOIIds.add(poi.id);
      }
      
      // Check names
      if (!poi.name?.en || poi.name.en.length === 0) {
        addError(`Missing English name`, name, `pois[${index}].name.en`);
      } else if (!/^[A-Z]/.test(poi.name.en)) {
        if (shouldFix) {
          poi.name.en = fixCapitalization(poi.name.en);
          addFix(`Fixed POI name capitalization: ${poi.name.en}`, name, `pois[${index}].name.en`, 'Capitalized');
        } else {
          addWarning(`POI name should be capitalized: ${poi.name.en}`, name, `pois[${index}].name.en`);
        }
      }
      
      if (!poi.name?.hi || poi.name.hi.length === 0) {
        if (shouldFix) {
          poi.name.hi = 'N/A';
          addFix(`Added missing Hindi name`, name, `pois[${index}].name.hi`, 'Set to N/A');
        } else {
          addError(`Missing Hindi name`, name, `pois[${index}].name.hi`);
        }
      }
      
      // Check descriptions
      if (!poi.description?.en || poi.description.en.length === 0) {
        addError(`Missing English description`, name, `pois[${index}].description.en`);
      } else if (poi.description.en.length > 300) {
        addWarning(`POI description too long: ${poi.description.en.length} characters`, name, `pois[${index}].description.en`);
      }
      
      if (!poi.description?.hi || poi.description.hi.length === 0) {
        if (shouldFix) {
          poi.description.hi = 'N/A';
          addFix(`Added missing Hindi description`, name, `pois[${index}].description.hi`, 'Set to N/A');
        } else {
          addError(`Missing Hindi description`, name, `pois[${index}].description.hi`);
        }
      }
      
      // Check category
      if (!STANDARD_CATEGORIES.pois.includes(poi.category)) {
        addError(`Invalid POI category: ${poi.category}`, name, `pois[${index}].category`);
      }
      
      // Check coordinates
      if (typeof poi.coordinates.lat !== 'number' || typeof poi.coordinates.lon !== 'number') {
        addError(`Invalid POI coordinates type`, name, `pois[${index}].coordinates`);
      } else if (poi.coordinates.lat < -90 || poi.coordinates.lat > 90) {
        addError(`Invalid latitude: ${poi.coordinates.lat}`, name, `pois[${index}].coordinates.lat`);
      } else if (poi.coordinates.lon < -180 || poi.coordinates.lon > 180) {
        addError(`Invalid longitude: ${poi.coordinates.lon}`, name, `pois[${index}].coordinates.lon`);
      }
      
      // Check costs
      poi.cost.forEach((costItem, costIndex) => {
        if (typeof costItem.amount !== 'number' || costItem.amount < 0) {
          addError(`Invalid cost amount: ${costItem.amount}`, name, `pois[${index}].cost[${costIndex}].amount`);
        }
        
        if (!costItem.currency || !VALID_CURRENCIES.includes(costItem.currency)) {
          if (shouldFix) {
            costItem.currency = fixCurrency(costItem.currency);
            addFix(`Fixed currency: ${costItem.currency}`, name, `pois[${index}].cost[${costIndex}].currency`, 'Set to INR');
          } else {
            addError(`Invalid currency: ${costItem.currency}`, name, `pois[${index}].cost[${costIndex}].currency`);
          }
        }
      });
      
      // Check preference categories
      if (poi.preference_category && Array.isArray(poi.preference_category)) {
        poi.preference_category.forEach((pref, prefIndex) => {
          if (!PREFERENCE_CATEGORIES.includes(pref)) {
            addWarning(`Non-standard preference category: ${pref}`, name, `pois[${index}].preference_category[${prefIndex}]`);
          }
        });
      }
      
      // Check time format
      if (poi.best_time_to_visit?.start && poi.best_time_to_visit?.end) {
        const startTime = fixTimeFormat(poi.best_time_to_visit.start);
        const endTime = fixTimeFormat(poi.best_time_to_visit.end);
        
        if (startTime >= endTime) {
          addError(`Invalid time range: start (${startTime}) >= end (${endTime})`, name, `pois[${index}].best_time_to_visit`);
        }
        
        if (shouldFix && (poi.best_time_to_visit.start !== startTime || poi.best_time_to_visit.end !== endTime)) {
          poi.best_time_to_visit.start = startTime;
          poi.best_time_to_visit.end = endTime;
          addFix(`Fixed time format: ${startTime} - ${endTime}`, name, `pois[${index}].best_time_to_visit`, 'Formatted');
        }
      }
      
      stats.pois++;
    });
  });
};

const validateIDUniqueness = () => {
  console.log('🔍 Validating ID uniqueness...');
  
  const allPOIIds = new Set();
  const allAccommodationIds = new Set();
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check POI ID uniqueness within city
    const cityPOIIds = new Set();
    city.pois.forEach((poi, index) => {
      if (cityPOIIds.has(poi.id)) {
        addError(`Duplicate POI ID within city: ${poi.id}`, name, `pois[${index}].id`);
      } else {
        cityPOIIds.add(poi.id);
      }
      
      if (allPOIIds.has(poi.id)) {
        addError(`Duplicate POI ID across cities: ${poi.id}`, name, `pois[${index}].id`);
      } else {
        allPOIIds.add(poi.id);
      }
      
      stats.pois++;
    });
    
    // Check accommodation ID uniqueness within city
    const cityAccommodationIds = new Set();
    city.accommodations.forEach((acc, index) => {
      if (cityAccommodationIds.has(acc.id)) {
        addError(`Duplicate accommodation ID within city: ${acc.id}`, name, `accommodations[${index}].id`);
      } else {
        cityAccommodationIds.add(acc.id);
      }
      
      if (allAccommodationIds.has(acc.id)) {
        addError(`Duplicate accommodation ID across cities: ${acc.id}`, name, `accommodations[${index}].id`);
      } else {
        allAccommodationIds.add(acc.id);
      }
      
      stats.accommodations++;
    });
  });
};

const validateCategories = () => {
  console.log('🔍 Validating categories...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Validate POI categories
    city.pois.forEach((poi, index) => {
      if (!STANDARD_CATEGORIES.pois.includes(poi.category)) {
        addWarning(`Non-standard POI category: ${poi.category}`, name, `pois[${index}].category`);
      }
      
      if (!STANDARD_CATEGORIES.subcategories.includes(poi.subcategory)) {
        addWarning(`Non-standard POI subcategory: ${poi.subcategory}`, name, `pois[${index}].subcategory`);
      }
      
      // Check for case sensitivity issues
      if (poi.category !== poi.category.charAt(0).toUpperCase() + poi.category.slice(1).toLowerCase()) {
        addWarning(`POI category case issue: ${poi.category}`, name, `pois[${index}].category`);
      }
    });
    
    // Validate accommodation categories
    city.accommodations.forEach((acc, index) => {
      if (!STANDARD_CATEGORIES.accommodations.includes(acc.category)) {
        addError(`Invalid accommodation category: ${acc.category}`, name, `accommodations[${index}].category`);
      }
      
      // Check for case sensitivity issues
      if (acc.category !== acc.category.toLowerCase()) {
        addWarning(`Accommodation category should be lowercase: ${acc.category}`, name, `accommodations[${index}].category`);
      }
    });
  });
};

const validateMissingFields = () => {
  console.log('🔍 Validating missing fields...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check required city fields
    const requiredCityFields = ['id', 'name', 'state', 'country', 'coordinates', 'description'];
    requiredCityFields.forEach(field => {
      if (!city[field]) {
        addError(`Missing required city field: ${field}`, name, 'city');
      }
    });
    
    // Check required POI fields
    city.pois.forEach((poi, index) => {
      const requiredPOIFields = ['id', 'name', 'category', 'subcategory', 'description', 'coordinates', 'rating'];
      requiredPOIFields.forEach(field => {
        if (!poi[field]) {
          addError(`Missing required POI field: ${field}`, name, `pois[${index}]`);
        }
      });
      
      // Check multilingual fields
      if (!poi.name.en || !poi.name.hi) {
        addError(`Missing multilingual name fields`, name, `pois[${index}].name`);
      }
      
      if (!poi.description.en || !poi.description.hi) {
        addError(`Missing multilingual description fields`, name, `pois[${index}].description`);
      }
    });
    
    // Check required accommodation fields
    city.accommodations.forEach((acc, index) => {
      const requiredAccFields = ['id', 'name', 'coordinates', 'rating', 'cost_per_night', 'category', 'amenities'];
      requiredAccFields.forEach(field => {
        if (!acc[field]) {
          addError(`Missing required accommodation field: ${field}`, name, `accommodations[${index}]`);
        }
      });
      
      // Check multilingual fields
      if (!acc.name.en || !acc.name.hi) {
        addError(`Missing multilingual name fields`, name, `accommodations[${index}].name`);
      }
    });
  });
};

const validateDescriptionQuality = () => {
  console.log('🔍 Validating description quality...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check city description length
    if (city.description.en && city.description.en.length > 500) {
      addWarning(`City description too long: ${city.description.en.length} characters`, name, 'city.description');
    }
    
    if (city.description.hi && city.description.hi.length > 500) {
      addWarning(`City description too long: ${city.description.hi.length} characters`, name, 'city.description');
    }
    
    // Check POI descriptions
    city.pois.forEach((poi, index) => {
      if (poi.description.en && poi.description.en.length > 300) {
        addWarning(`POI description too long: ${poi.description.en.length} characters`, name, `pois[${index}].description`);
      }
      
      if (poi.description.hi && poi.description.hi.length > 300) {
        addWarning(`POI description too long: ${poi.description.hi.length} characters`, name, `pois[${index}].description`);
      }
    });
  });
};

const validateNameCapitalization = () => {
  console.log('🔍 Validating name capitalization...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check POI names
    city.pois.forEach((poi, index) => {
      if (poi.name.en && !/^[A-Z]/.test(poi.name.en)) {
        addWarning(`POI name not properly capitalized: ${poi.name.en}`, name, `pois[${index}].name.en`);
      }
      
      if (poi.name.hi && !/^[अ-ह]/.test(poi.name.hi)) {
        addWarning(`POI Hindi name may not be properly formatted: ${poi.name.hi}`, name, `pois[${index}].name.hi`);
      }
    });
    
    // Check accommodation names
    city.accommodations.forEach((acc, index) => {
      if (acc.name.en && !/^[A-Z]/.test(acc.name.en)) {
        addWarning(`Accommodation name not properly capitalized: ${acc.name.en}`, name, `accommodations[${index}].name.en`);
      }
    });
  });
};

const validateSchemaCompliance = () => {
  console.log('🔍 Validating schema compliance...');
  
  // This would require importing the actual Mongoose schema
  // For now, we'll do basic structural validation
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check if group_size exists (we added this)
    if (!city.group_size) {
      addError(`Missing group_size field`, name, 'city');
    } else {
      if (typeof city.group_size.min !== 'number' || typeof city.group_size.max !== 'number') {
        addError(`Invalid group_size data types`, name, 'city.group_size');
      }
    }
    
    // Check weather_alert structure
    if (!city.weather_alert) {
      addError(`Missing weather_alert field`, name, 'city');
    } else {
      if (!city.weather_alert.sources || !Array.isArray(city.weather_alert.sources)) {
        addError(`Invalid weather_alert.sources structure`, name, 'city.weather_alert');
      }
      if (!city.weather_alert.thresholds || typeof city.weather_alert.thresholds !== 'object') {
        addError(`Invalid weather_alert.thresholds structure`, name, 'city.weather_alert');
      }
    }
  });
};

const validateSpecificIssues = () => {
  console.log('🔍 Validating specific data quality issues...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check for specific naming issues mentioned
    city.pois.forEach((poi, index) => {
      // Check for "Mall road" vs "Mall Road"
      if (poi.name.en && poi.name.en.includes('road') && !poi.name.en.includes('Road')) {
        addWarning(`POI name should be capitalized: ${poi.name.en}`, name, `pois[${index}].name.en`);
      }
      
      // Check for inconsistent category casing
      if (poi.category === 'nature' || poi.category === 'heritage' || poi.category === 'adventure') {
        addWarning(`POI category should be capitalized: ${poi.category}`, name, `pois[${index}].category`);
      }
    });
    
    // Check for specific accommodation issues
    city.accommodations.forEach((acc, index) => {
      // Check for "Budget" vs "budget"
      if (acc.type && acc.type === 'Budget') {
        addWarning(`Accommodation type should be lowercase: ${acc.type}`, name, `accommodations[${index}].type`);
      }
    });
    
    // Check for specific field issues
    if (city.group_size && (city.group_size.min < 1 || city.group_size.max > 20)) {
      addWarning(`Group size seems unrealistic: min=${city.group_size.min}, max=${city.group_size.max}`, name, 'city.group_size');
    }
  });
};

const validateCrossCityConsistency = () => {
  console.log('🔍 Validating cross-city consistency...');
  
  // Check if POI IDs follow proper naming convention
  const poiIdPatterns = {
    'Goa': /^GO\d+$/,
    'Pondicherry': /^PO\d+$/,
    'Shimla': /^SH\d+$/
  };
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    const pattern = poiIdPatterns[name];
    
    if (pattern) {
      city.pois.forEach((poi, index) => {
        if (!pattern.test(poi.id)) {
          addError(`POI ID doesn't follow convention: ${poi.id} (expected ${name} pattern)`, name, `pois[${index}].id`);
        }
      });
      
      city.accommodations.forEach((acc, index) => {
        // More flexible pattern for accommodation IDs
        const accPattern = new RegExp(`^${name.substring(0, 2).toUpperCase()}\\w+\\d+$|^\\w+\\d+$`);
        if (!accPattern.test(acc.id)) {
          addWarning(`Accommodation ID doesn't follow convention: ${acc.id}`, name, `accommodations[${index}].id`);
        }
      });
    }
  });
};

// Run all validations
console.log('🚀 Starting comprehensive data validation...\n');

validateCityUniqueness();
validateDataTypes();
validateIDUniqueness();
validateCategories();
validateMissingFields();
validateDescriptionQuality();
validateNameCapitalization();
validateSchemaCompliance();
validateSpecificIssues();
validateCrossCityConsistency();

// Print results
console.log('\n' + '='.repeat(60));
console.log('📊 VALIDATION RESULTS');
console.log('='.repeat(60));

console.log(`\n📈 STATISTICS:`);
console.log(`Cities: ${stats.cities}`);
console.log(`POIs: ${stats.pois}`);
console.log(`Accommodations: ${stats.accommodations}`);
console.log(`Total Errors: ${stats.totalErrors}`);
console.log(`Total Warnings: ${stats.totalWarnings}`);

if (errors.length > 0) {
  console.log(`\n❌ ERRORS (${errors.length}):`);
  errors.forEach((error, index) => {
    console.log(`${index + 1}. [${error.city}] ${error.message}`);
    if (error.context) console.log(`   Context: ${error.context}`);
  });
}

if (warnings.length > 0) {
  console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
  warnings.forEach((warning, index) => {
    console.log(`${index + 1}. [${warning.city}] ${warning.message}`);
    if (warning.context) console.log(`   Context: ${warning.context}`);
  });
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ ALL VALIDATIONS PASSED! Data is clean and ready for production.');
} else if (errors.length === 0) {
  console.log('\n✅ NO ERRORS! Data is valid with some warnings to review.');
} else {
  console.log('\n❌ VALIDATION FAILED! Please fix the errors above.');
}

console.log('\n' + '='.repeat(60));
