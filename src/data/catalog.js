import approvedRaw from './approvedUseCases.json'
import configRaw from '../../catalog-config.json'

const approved = approvedRaw || []

export const CATALOG = configRaw.industries.map(industry => ({
  ...industry,
  valueChains: industry.valueChains.map(vc => ({
    ...vc,
    useCases: vc.useCases.map(ucName => {
      const match = approved.find(a =>
        a.industry === industry.name &&
        a.valueChain === vc.label &&
        a.title === ucName
      )
      if (match) return { ...match, status: 'approved' }
      return { title: ucName, status: 'coming-soon', hasDemo: false }
    })
  }))
}))

export default CATALOG
