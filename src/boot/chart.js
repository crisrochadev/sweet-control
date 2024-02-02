import { boot } from 'quasar/wrappers'
import Chart from 'chart.js/auto';

// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async ( { app } ) => {
  app.config.globalProperties.$Chart = Chart;
})
