import straightWaistband from './straight-waistband'
import curvedWaistband from './curved-waistband'

export default part => {
  let { store, options } = part.shorthand()
  console.log('WB', store.get('topCircumference'))

  if (options.waistbandShape === 'curved') return curvedWaistband(part)
  else return straightWaistband(part)
}
