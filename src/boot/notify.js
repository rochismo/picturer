import { Notify } from 'quasar'

Notify.registerType('copied', {
  icon: 'announcement',
  progress: true,
  color: 'primary',
  textColor: 'white',
  classes: 'glossy'
})
export default async (/* { app, router, Vue ... } */) => {
  // something to do
}
