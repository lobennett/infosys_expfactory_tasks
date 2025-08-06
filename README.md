# Experiment Factory Experiments

This repository contains Experiment Factory tasks that can be deployed using [Expfactory Deploy](https://github.com/expfactory/expfactory-deploy) and run locally with [Expfactory Deploy Local](https://github.com/expfactory/expfactory-deploy/tree/main/expfactory_deploy_local).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Available Tasks

This repository includes the following psychological experiments:

- [**Cognitive Flexibility Inventory (CFI)**](cfi/) - Measures cognitive flexibility and adaptability
- [**Digit Span**](digit_span/) - Working memory assessment task
- [**General Risk Propensity Scale (GRIPS)**](grips/) - Risk-taking behavior assessment
- [**Kirby Delay-Discounting Task**](kirby/) - Measures impulsivity and delay discounting
- [**Raven's Progressive Matrices**](ravens/) - Non-verbal reasoning and intelligence assessment
- [**Ten Item Personality Inventory**](ten_item_personality/) - Brief personality assessment

## Preview Links

Try out the tasks online at deploy.expfactory.org:

- [Cognitive Flexibility Inventory](https://deploy.expfactory.org/preview/72/)
- [Digit Span](https://deploy.expfactory.org/preview/73/)
- [General Risk Propensity Scale](https://deploy.expfactory.org/preview/74/)
- [Kirby Delay-Discounting Task](https://deploy.expfactory.org/preview/75/)
- [Raven's Progressive Matrices](https://deploy.expfactory.org/preview/76/)
- [Ten Item Personality Inventory](https://deploy.expfactory.org/preview/77/)

## Getting Started

To deploy the tasks locally:

1. Clone this repository:

```bash
git clone https://github.com/lobennett/infosys_expfactory_tasks.git
```

2. Clone the Expfactory Deploy repository:

```bash
git clone https://github.com/expfactory/expfactory-deploy.git
```

3. Create a virtual environment and install Expfactory Deploy Local:

```bash
cd expfactory-deploy
pip install ./expfactory_deploy_local
```
