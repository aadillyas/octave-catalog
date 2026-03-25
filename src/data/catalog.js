import approvedRaw from './approvedUseCases.json'
import configRaw from '../../catalog-config.json'
import { getEntityAccent, resolveIconKey } from '../utils/iconResolver'

const approved = approvedRaw || []

export const CATALOG = configRaw.industries.map(industry => ({
  ...industry,
  iconKey: resolveIconKey({ entityType: 'industry', iconKey: industry.icon, id: industry.id, label: industry.name }),
  accent: getEntityAccent('industry', resolveIconKey({ entityType: 'industry', iconKey: industry.icon, id: industry.id, label: industry.name })),
  valueChains: industry.valueChains.map(vc => ({
    ...vc,
    iconKey: resolveIconKey({ entityType: 'valueChain', iconKey: vc.icon, id: vc.id, label: vc.label }),
    accent: getEntityAccent('valueChain', resolveIconKey({ entityType: 'valueChain', iconKey: vc.icon, id: vc.id, label: vc.label })),
    useCases: vc.useCases.map(ucName => {
      const match = approved.find(a =>
        a.industry === industry.name &&
        a.valueChain === vc.label &&
        a.title === ucName
      )
      if (match) {
        const iconKey = resolveIconKey({ entityType: 'useCase', iconKey: match.icon, id: match.id, label: match.title })
        return {
          ...match,
          status: 'approved',
          iconKey,
          accent: getEntityAccent('useCase', iconKey),
          input: match.input ? {
            ...match.input,
            sources: (match.input.sources || []).map(source => {
              const sourceIconKey = resolveIconKey({
                entityType: 'source',
                iconKey: source.icon,
                id: source.id || source.name,
                label: source.name,
              })
              return {
                ...source,
                iconKey: sourceIconKey,
                accent: getEntityAccent('source', sourceIconKey),
              }
            }),
          } : match.input,
        }
      }
      const iconKey = resolveIconKey({ entityType: 'useCase', id: ucName, label: ucName })
      return {
        title: ucName,
        status: 'coming-soon',
        hasDemo: false,
        iconKey,
        accent: getEntityAccent('useCase', iconKey),
      }
    })
  }))
}))

export default CATALOG
