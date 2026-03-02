// Build-time catalog loader.
// Exports hardcoded catalog shape. Use cases without real content fall back to Coming Soon.
export const CATALOG = {
  industries: [
    {
      id: 'retail',
      name: 'Retail',
      tagline: 'From shelf to checkout — end to end',
      valueChains: [
        { id: 'buying_ranging', name: 'Buying & Ranging', useCases: ['Assortment Optimization'] },
        { id: 'pricing_promotions', name: 'Pricing & Promotions', useCases: [] },
        { id: 'supply_chain', name: 'Supply Chain', useCases: [] },
        { id: 'store_operations', name: 'Store Operations', useCases: [] },
        { id: 'customer_marketing', name: 'Customer & Marketing', useCases: [] },
        { id: 'people_finance', name: 'People & Finance', useCases: [] },
      ],
    },
    {
      id: 'fmcg',
      name: 'FMCG',
      tagline: 'Production to shelf, optimised',
      valueChains: [
        { id: 'production_planning', name: 'Production & Planning', useCases: [] },
        { id: 'distribution_logistics', name: 'Distribution & Logistics', useCases: [] },
        { id: 'trade_promotions', name: 'Trade & Promotions', useCases: [] },
        { id: 'sales_force', name: 'Sales Force', useCases: [] },
        { id: 'marketing', name: 'Marketing', useCases: [] },
      ],
    },
    {
      id: 'leisure_hospitality',
      name: 'Leisure & Hospitality',
      tagline: 'Guest experience and operational efficiency',
      valueChains: [
        { id: 'acquisition_revenue', name: 'Acquisition & Revenue', useCases: [] },
        { id: 'guest_experience', name: 'Guest Experience', useCases: [] },
        { id: 'food_beverage', name: 'Food & Beverage', useCases: [] },
        { id: 'property_operations', name: 'Property Operations', useCases: ['Energy Optimization'] },
        { id: 'workforce', name: 'Workforce', useCases: [] },
      ],
    },
    {
      id: 'banking_financial_services',
      name: 'Banking & Financial Services',
      tagline: 'Risk, retention and growth',
      valueChains: [
        { id: 'customer_acquisition', name: 'Customer Acquisition', useCases: [] },
        { id: 'customer_retention', name: 'Customer Retention', useCases: [] },
        { id: 'underwriting_risk', name: 'Underwriting & Risk', useCases: [] },
        { id: 'agent_productivity', name: 'Agent Productivity', useCases: [] },
      ],
    },
    {
      id: 'transport_energy',
      name: 'Transport & Energy',
      tagline: 'Demand, dispatch and procurement',
      valueChains: [
        { id: 'demand_planning', name: 'Demand Planning', useCases: [] },
        { id: 'procurement_dispatch', name: 'Procurement & Dispatch', useCases: [] },
      ],
    },
  ],
}
