|   Status   |                Type                 | Env Vars Change |           Ticket           |
| :--------: | :---------------------------------: | :-------------: | :------------------------: |
| Ready/Hold | Feature/Bug/Tooling/Refactor/Hotfix |     Yes/No      | [Link](<ticket link here>) |

> ⚠️ NOTE: use notes like this to emphasize something about the PR. This could include other PRs this PR is built on top of; new or removed environment variables; reasons for why the PR is on hold; or anything else you would like to draw attention to.

### What does this PR do

_What problem are you trying to solve?_

### Solution

_How did you solve the problem?_

### Before & After Screenshots

**BEFORE**:
[insert screenshot here]

**AFTER**:
[insert screenshot here]

### Other changes (e.g. bug fixes, UI tweaks, small refactors)

&nbsp;

### Vue component criteria

Vue components should be (Please use the ✅ emoji on the criteria you have met ):

1. Reused and Reusable (if it already exists, don't create it again. Component should able to stand alone, be reused in another context, be copied to another project - in most cases)
2. Responsive (Layout flows smoothly through breakpoints, using mobile and desktop layouts as references. Use Storybook to help test!)

3. Semantic (use the most relevant [HTML5 elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element); avoid divs and spans unless needed)
4. Accessible
5. Optimized for performance, as much as you can (when applicable)
6. Content-flexible (use Storybook!)
7. Conforming to our code style guides (fallback: [Vue style guide](https://vuejs.org/v2/style-guide))
8. Named according to our guidelines (fallback: [Vue Style Guide guidelines](https://vuejs.org/v2/style-guide/#Single-file-component-filename-casing-strongly-recommended))
9. Documented with JSdoc syntax (so comments show up in Storybook docs tab)

&nbsp;

### Deploy Notes

_Notes regarding deployment of the contained body of work. These should note any
new dependencies, new scripts, etc._

**New environment variables**:

-   `env var` : env var details

**New scripts**:

-   `script` : script details

**New dependencies**:

-   `dependency` : dependency details

**New dev dependencies**:

-   `dependency` : dependency details
