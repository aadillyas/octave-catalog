import { ICONS } from '../components/icons'
import { tokens } from '../styles/tokens'

const normalize = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const ID_MAPS = {
  industry: {
    retail: 'retail',
    fmcg: 'fmcg',
    'leisure-hospitality': 'hospitality',
    'banking-financial-services': 'banking',
    'transport-energy': 'transport',
  },
  valueChain: {
    'buying-ranging': 'buying',
    'pricing-promotions': 'pricing',
    'supply-chain': 'supply',
    'store-operations': 'operations',
    'customer-marketing': 'marketing',
    'people-finance': 'workforce',
    'production-planning': 'production',
    'distribution-logistics': 'logistics',
    'trade-promotions': 'pricing',
    'sales-force': 'workforce',
    marketing: 'marketing',
    'acquisition-revenue': 'revenue',
    'guest-experience': 'guest',
    'food-beverage': 'hospitality',
    'property-operations': 'operations',
    workforce: 'workforce',
    'customer-acquisition': 'acquisition',
    'customer-retention': 'retention',
    'underwriting-risk': 'risk',
    'agent-productivity': 'workforce',
    'demand-planning': 'forecast',
    'procurement-dispatch': 'dispatch',
  },
  useCase: {
    'factory-production-planning': 'production',
    'energy-optimization': 'energy',
    'retail-fraud-detection': 'fraud',
  },
  source: {
    bms: 'building',
    'building-management-system-bms': 'building',
    'property-management-system-pms': 'occupancy',
    'weather-forecast-api': 'weather',
    'smart-metering': 'meter',
    'historical-operations-log': 'history',
  },
}

const LABEL_MAPS = {
  industry: {
    retail: 'retail',
    fmcg: 'fmcg',
    'leisure-and-hospitality': 'hospitality',
    'banking-and-financial-services': 'banking',
    'transport-and-energy': 'transport',
  },
  valueChain: {
    'store-operations': 'operations',
    'property-operations': 'operations',
    'production-and-planning': 'production',
    'distribution-and-logistics': 'logistics',
    'pricing-and-promotions': 'pricing',
    'trade-and-promotions': 'pricing',
    'buying-and-ranging': 'buying',
    'customer-and-marketing': 'marketing',
    'agent-productivity': 'workforce',
    'demand-planning': 'forecast',
    'procurement-and-dispatch': 'dispatch',
  },
  useCase: {
    'energy-optimisation': 'energy',
    'energy-optimization': 'energy',
    'retail-fraud-detection': 'fraud',
    'factory-production-planning': 'production',
  },
  source: {
    'building-management-system-bms': 'building',
    'property-management-system-pms': 'occupancy',
    'weather-forecast-api': 'weather',
    'smart-metering': 'meter',
    'historical-operations-log': 'history',
  },
}

const FALLBACKS = {
  industry: 'genericIndustry',
  valueChain: 'genericValueChain',
  useCase: 'genericUseCase',
  source: 'genericSource',
}

export const resolveIconKey = ({ entityType, iconKey, id, label }) => {
  const normalizedId = normalize(id)
  const normalizedLabel = normalize(label)
  const isValid = key => Boolean(ICONS[key])

  if (iconKey && isValid(iconKey)) return iconKey

  const idMatch = ID_MAPS[entityType]?.[normalizedId]
  if (idMatch && isValid(idMatch)) return idMatch

  const labelMatch = LABEL_MAPS[entityType]?.[normalizedLabel]
  if (labelMatch && isValid(labelMatch)) return labelMatch

  return FALLBACKS[entityType] || 'genericUseCase'
}

export const getEntityAccent = (entityType, resolvedIconKey) => {
  const tealKeys = new Set([
    'hospitality',
    'supply',
    'guest',
    'output',
    'results',
    'weather',
    'meter',
    'delivery',
  ])

  if (['genericIndustry', 'genericValueChain', 'genericUseCase', 'genericSource'].includes(resolvedIconKey)) {
    return entityType === 'source' ? tokens.tealText : tokens.pink
  }

  return tealKeys.has(resolvedIconKey) ? tokens.tealText : tokens.pink
}
