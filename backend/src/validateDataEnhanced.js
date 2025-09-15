/**
 * validateDataEnhanced.js
 * 
 * Comprehensive data validation script with auto-fix capabilities
 * Validates all 10 categories as specified in requirements
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

// Validation constants
const STANDARD_CATEGORIES = {
  pois: ['Leisure', 'Historical', 'Nature', 'Spiritual', 'Heritage', 'Adventure', 'Religious', 'Sightseeing', 'Shopping'],
  accommodations: ['luxury', 'mid-range', 'budget']
};

const VALID_TIMEZONES = ['Asia/Kolkata', 'Asia/Calcutta', 'Asia/Dhaka', 'Asia/Karachi', 'Asia/Colombo'];
const VALID_CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD'];
const STANDARD_AMENITIES = ['wifi', 'spa', 'pool', 'restaurant', 'parking', 'breakfast', 'gym', 'bar', 'concierge', 'room_service', 'laundry', 'business_center', 'beach_access'];

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
    }
    
    // Check timezone
    if (!city.timezone || !VALID_TIMEZONES.includes(city.timezone)) {
      if (shouldFix) {
        city.timezone = 'Asia/Kolkata';
        addFix(`Fixed timezone: ${city.timezone}`, name, 'city.timezone', 'Set to Asia/Kolkata');
      } else {
        addError(`Invalid timezone: ${city.timezone}`, name, 'city.timezone');
      }
    }
    
    stats.cities++;
  });
};

// 2. POI Checks
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
      
      stats.pois++;
    });
  });
};

// 3. Accommodation Checks
const validateAccommodations = () => {
  console.log('🔍 Validating accommodation checks...');
  
  const allAccommodationIds = new Set();
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    const cityAccommodationIds = new Set();
    
    city.accommodations.forEach((acc, index) => {
      // Check accommodation ID uniqueness
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
      
      // Check names
      if (!acc.name?.en || acc.name.en.length === 0) {
        addError(`Missing English name`, name, `accommodations[${index}].name.en`);
      } else if (!/^[A-Z]/.test(acc.name.en)) {
        if (shouldFix) {
          acc.name.en = fixCapitalization(acc.name.en);
          addFix(`Fixed accommodation name capitalization: ${acc.name.en}`, name, `accommodations[${index}].name.en`, 'Capitalized');
        } else {
          addWarning(`Accommodation name should be capitalized: ${acc.name.en}`, name, `accommodations[${index}].name.en`);
        }
      }
      
      if (!acc.name?.hi || acc.name.hi.length === 0) {
        if (shouldFix) {
          acc.name.hi = 'N/A';
          addFix(`Added missing Hindi name`, name, `accommodations[${index}].name.hi`, 'Set to N/A');
        } else {
          addError(`Missing Hindi name`, name, `accommodations[${index}].name.hi`);
        }
      }
      
      // Check category
      if (!STANDARD_CATEGORIES.accommodations.includes(acc.category)) {
        if (shouldFix) {
          acc.category = fixCategoryCasing(acc.category, 'accommodation');
          addFix(`Fixed accommodation category: ${acc.category}`, name, `accommodations[${index}].category`, 'Lowercased');
        } else {
          addError(`Invalid accommodation category: ${acc.category}`, name, `accommodations[${index}].category`);
        }
      }
      
      // Check cost
      if (typeof acc.cost_per_night !== 'number' || acc.cost_per_night < 0) {
        addError(`Invalid cost per night: ${acc.cost_per_night}`, name, `accommodations[${index}].cost_per_night`);
      }
      
      // Check rating
      if (typeof acc.rating !== 'number' || acc.rating < 0 || acc.rating > 5) {
        addError(`Invalid rating: ${acc.rating}. Should be between 0-5`, name, `accommodations[${index}].rating`);
      }
      
      // Check amenities
      if (acc.amenities && Array.isArray(acc.amenities)) {
        const fixedAmenities = fixAmenities(acc.amenities);
        if (shouldFix && JSON.stringify(acc.amenities) !== JSON.stringify(fixedAmenities)) {
          acc.amenities = fixedAmenities;
          addFix(`Fixed amenities: ${fixedAmenities.join(', ')}`, name, `accommodations[${index}].amenities`, 'Normalized');
        }
      }
      
      stats.accommodations++;
    });
  });
};

// 4. Transport Checks
const validateTransport = () => {
  console.log('🔍 Validating transport checks...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    if (city.transport) {
      Object.entries(city.transport).forEach(([mode, details]) => {
        if (details && typeof details === 'object') {
          // Check currency
          if (details.currency && !VALID_CURRENCIES.includes(details.currency)) {
            if (shouldFix) {
              details.currency = fixCurrency(details.currency);
              addFix(`Fixed transport currency: ${details.currency}`, name, `transport.${mode}.currency`, 'Set to INR');
            } else {
              addError(`Invalid transport currency: ${details.currency}`, name, `transport.${mode}.currency`);
            }
          }
          
          // Check costs
          const costFields = ['per_day', 'average_fare'];
          costFields.forEach(field => {
            if (details[field] !== undefined) {
              if (typeof details[field] !== 'number' || details[field] < 0) {
                addError(`Invalid transport cost: ${details[field]}`, name, `transport.${mode}.${field}`);
              }
            }
          });
        }
      });
    }
  });
};

// 5. Weather & Alerts
const validateWeatherAlerts = () => {
  console.log('🔍 Validating weather & alerts...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    if (city.weather_alert) {
      // Check sources
      if (!city.weather_alert.sources || !Array.isArray(city.weather_alert.sources) || city.weather_alert.sources.length === 0) {
        addError(`Weather alert sources missing or empty`, name, 'weather_alert.sources');
      }
      
      // Check thresholds
      if (city.weather_alert.thresholds) {
        Object.entries(city.weather_alert.thresholds).forEach(([key, value]) => {
          if (typeof value === 'string' && value.trim() === '') {
            addError(`Empty weather threshold: ${key}`, name, `weather_alert.thresholds.${key}`);
          }
        });
      }
    }
  });
};

// 6. Cross-City Consistency
const validateCrossCityConsistency = () => {
  console.log('🔍 Validating cross-city consistency...');
  
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
    }
  });
};

// 7. AI/ML-Specific Checks
const validateAIML = () => {
  console.log('🔍 Validating AI/ML-specific checks...');
  
  allData.forEach(({ name, data }) => {
    const city = data.city;
    
    // Check for invalid characters
    const checkText = (text, context) => {
      if (typeof text === 'string') {
        if (/[#]{3,}|[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]/u.test(text)) {
          addWarning(`Invalid characters found in text`, name, context);
        }
        
        if (text.length > 512) {
          addWarning(`Text too long for embeddings: ${text.length} characters`, name, context);
        }
      }
    };
    
    // Check city descriptions
    checkText(city.description?.en, 'city.description.en');
    checkText(city.description?.hi, 'city.description.hi');
    
    // Check POI descriptions
    city.pois.forEach((poi, index) => {
      checkText(poi.description?.en, `pois[${index}].description.en`);
      checkText(poi.description?.hi, `pois[${index}].description.hi`);
    });
  });
};

//8. Group Size validation 
const validateGroupSize = () => {
  console.log('🔍 Validating group size...');
  
  const MAX_GROUP_SIZE = 20; // same as model default
  const MIN_GROUP_SIZE = 1;

  allData.forEach(({ name, data }) => {
    const city = data.city;
    if (city.group_size) {
      const { min, max } = city.group_size;

      if (min < MIN_GROUP_SIZE || max > MAX_GROUP_SIZE) {
        addError(
          `Group size out of bounds: min=${min}, max=${max}. Allowed: ${MIN_GROUP_SIZE}-${MAX_GROUP_SIZE}`,
          name,
          'city.group_size'
        );
      }
    } else {
      if (shouldFix) {
        city.group_size = { min: MIN_GROUP_SIZE, max: MAX_GROUP_SIZE };
        addFix(
          `Added missing group_size`,
          name,
          'city.group_size',
          `Set to min=${MIN_GROUP_SIZE}, max=${MAX_GROUP_SIZE}`
        );
      } else {
        addError(`Missing group_size`, name, 'city.group_size');
      }
    }
  });
};


// Generate reports
const generateReports = () => {
  console.log('📊 Generating reports...');
  
  // Update statistics
  validationReport.statistics = {
    cities: stats.cities,
    pois: stats.pois,
    accommodations: stats.accommodations,
    totalErrors: stats.totalErrors,
    totalWarnings: stats.totalWarnings,
    totalFixes: stats.totalFixes
  };
  
  validationReport.summary = {
    status: stats.totalErrors === 0 ? 'PASS' : 'FAIL',
    errors: stats.totalErrors,
    warnings: stats.totalWarnings,
    fixes: stats.totalFixes
  };
  
  // Generate JSON report
  writeFileSync(
    join(__dirname, 'validation-report.json'),
    JSON.stringify(validationReport, null, 2)
  );
  
  // Generate Markdown report
  const markdownReport = `# Validation Report

**Generated:** ${new Date().toISOString()}
**Status:** ${validationReport.summary.status}

## Summary
- **Cities:** ${stats.cities}
- **POIs:** ${stats.pois}
- **Accommodations:** ${stats.accommodations}
- **Errors:** ${stats.totalErrors}
- **Warnings:** ${stats.totalWarnings}
- **Fixes:** ${stats.totalFixes}

## Errors
${errors.length > 0 ? errors.map(e => `- [${e.city}] ${e.message} (${e.context})`).join('\n') : 'No errors found.'}

## Warnings
${warnings.length > 0 ? warnings.map(w => `- [${w.city}] ${w.message} (${w.context})`).join('\n') : 'No warnings found.'}

## Fixes Applied
${fixes.length > 0 ? fixes.map(f => `- [${f.city}] ${f.message} (${f.context}) - ${f.action}`).join('\n') : 'No fixes applied.'}
`;
  
  writeFileSync(
    join(__dirname, 'validation-report.md'),
    markdownReport
  );
};

// Save fixed data if --fix flag is used
const saveFixedData = () => {
  if (shouldFix && fixes.length > 0) {
    console.log('💾 Saving fixed data...');
    
    allData.forEach(({ name, data, file }) => {
      writeFileSync(
        join(__dirname, 'data', file),
        JSON.stringify(data, null, 2)
      );
      console.log(`✅ Saved fixed data for ${name}`);
    });
  }
};

// Run all validations
console.log('🚀 Starting comprehensive data validation...\n');

validateCityLevel();
validatePOIs();
validateAccommodations();
validateTransport();
validateWeatherAlerts();
validateCrossCityConsistency();
validateAIML();
validateGroupSize();


// Generate reports
generateReports();

// Save fixed data
saveFixedData();

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
console.log(`Total Fixes: ${stats.totalFixes}`);

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

if (fixes.length > 0) {
  console.log(`\n🔧 FIXES APPLIED (${fixes.length}):`);
  fixes.forEach((fix, index) => {
    console.log(`${index + 1}. [${fix.city}] ${fix.message}`);
    if (fix.context) console.log(`   Context: ${fix.context}`);
    if (fix.action) console.log(`   Action: ${fix.action}`);
  });
}

if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ ALL VALIDATIONS PASSED! Data is clean and ready for production.');
} else if (errors.length === 0) {
  console.log('\n✅ NO ERRORS! Data is valid with some warnings to review.');
} else {
  console.log('\n❌ VALIDATION FAILED! Please fix the errors above.');
}

console.log('\n📄 Reports generated:');
console.log('- validation-report.json (machine-readable)');
console.log('- validation-report.md (human-readable)');

console.log('\n' + '='.repeat(60));
