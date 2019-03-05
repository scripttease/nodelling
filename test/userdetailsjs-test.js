const { cssValidLangName, } = require('../public/user-details.js')

describe('cssValidLangName', function () {
  it('takes string and retrns css valid string', () => {
    const name = 'Vim Script'
    expect(cssValidLangName(name).to.equal('vimscript'))
  })
})