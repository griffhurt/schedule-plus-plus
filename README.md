# Schedule++
A browser extension that adds additional features to college scheduling.

Written by: Griffin Hurt (griffhurt), Joe Altvater (jca64), and Carson Gollinger (nosra)

![Example of usage](/img/schedule.png)

**The current version of Schedule++ only works with University of Pittsburgh's PeopleSoft.**

## Installation
### Pre-packaged Extension
You can download the pre-packaged extension from the "Releases" tab to the right. 

In Chrome, navigate to [chrome://extensions/](chrome://extensions/), turn on "Developer mode" with the switch in the top right corner of the page, and drag the `schedule-plus-plus_XX.XX.XX.crx` file onto the page.

In Firefox, navigate to [about:addons](about:addons), press the gear in the top right corner, click "Install Add-on From File...", and select the `schedule-plus-plus_XX.XX.XX.xpi` file.

*We are currently working on distributing Schedule++ on the Chrome and Firefox extension stores.*

### Loading from Source

First, clone this repository locally:
> `git clone https://github.com/griffhurt/schedule-plus-plus.git`

In Chrome, go to [chrome://extensions/](chrome://extensions/), turn on "Developer mode" with the switch in the top right corner of the page, press "Load unpacked", and select the `schedule-plus-plus` folder.

In Firefox, go to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox), press "Load Temporary Add-on...", and select the `schedule-plus-plus` folder.

## Features
Currently, the extension adds visible RateMyProfessors scores to PeopleSoft on the following pages:
* Schedule
* Class Search
* Shopping Cart
* Edit Enrollment
* Drop Classes
* Schedule Builder
    * Select Sections
    * Schedules
    * Favorites

When available, Schedule++ will also show you the difficulty and quality for the course based on reviews for the professor.

## Support / Issues
If you find a bug or problem, please open a new Issue here on GitHub and describe the problem as best you can. Please include your browser, browser version, and screenshots if possible. You can also email me at `hurtg (at) acm (dot) org`.

## Contributing
We encouage pull requests that fix bugs or add new features! 

## License
We use the [MIT license](LICENSE).

