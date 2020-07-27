const BasicGenerator = require('../../BasicGenerator');

class Generator extends BasicGenerator {
  prompting() {
    const prompts = [
      {
        name: 'name',
        message: `What's the block name?`,
        default: this.name,
      },
      {
        name: 'description',
        message: `What's your block description?`,
      },
      {
        name: 'mail',
        message: `What's your email?`,
      },
      {
        name: 'author',
        message: `What's your name?`,
      }
    ];
    return this.prompt(prompts).then(props => {
      this.prompts = props;
    });
  }

  writing() {

  }
}

module.exports = Generator;
