# Example <Language> <Tool> <Consumer|Provider>

<!-- Build Badge -->

[![Build](https://github.com/pactflow/<repo>/actions/workflows/build.yml/badge.svg)](https://github.com/pactflow/<repo>/actions/workflows/build.yml)

<!-- Can I Deploy Badge -->

[![Can I deploy Status](https://testdemo.pactflow.io/pacticipants/<repo>/branches/main/latest-version/can-i-deploy/to-environment/production/badge)](https://testdemo.pactflow.io/pacticipants/<repo>/branches/main/latest-version/can-i-deploy/to-environment/production/badge)

- [Example <Language> <Tool> <Consumer|Provider>](#example-language-tool-consumerprovider)
  - [Overview of Example](#overview-of-example)
    - [Key points](#key-points)
  - [Overview of Part of <BDCT/CDCT> Flow](#overview-of-part-of-bdctcdct-flow)
  - [Compatibile with <Consumers|Providers>](#compatibile-with-consumersproviders)
  - [Pre-requisites](#pre-requisites)
    - [Environment variables](#environment-variables)
  - [Usage](#usage)
    - [Steps](#steps)
    - [Use case with <Tool>](#use-case-with-tool)
  - [OS/Platform specific considerations](#osplatform-specific-considerations)
    - [Windows](#windows)
  - [Caveats](#caveats)
  - [Related topics / posts / discussions](#related-topics--posts--discussions)
  - [Other examples of how to do this form of testing](#other-examples-of-how-to-do-this-form-of-testing)
  - [Found an issue?](#found-an-issue)

## Overview of Example

<!-- Consumer Overview -->

This is an example of a <language> "Product" API consumer that uses <tool>, Pact, [Pactflow](https://pactflow.io) and GitHub Actions to generate and publish Pact consumer contracts.

It performs pre-deployment cross-compatibility checks to ensure that it is compatible with specified providers using the Bi-Directional contract capability of Pactflow.

<!-- Provider Overview -->

This is an example of a <language> "Product" API Provider that uses <tool>, Pact, [Pactflow](https://pactflow.io) and GitHub Actions to generate and publish Pact provider contracts.

It performs pre-deployment cross-compatability checks to ensure that it is compatible with specified consumers using the Bi-Directional contract capability of Pactflow.

<!-- General -->

See the full [Pactflow Bi-Directional Workshop](https://docs.pactflow.io/docs/workshops/bi-directional-contract-testing) for which this can be substituted in as the <consumer|provider>".


### Key points

It:

- x
- y
- z

What is uploaded to Pactflow is an OpenAPI specification that represents what you actually tested with <tool>, to give us confidence it is compatible with a Pact consumer.

## Overview of Part of <BDCT/CDCT> Flow


<!-- Consumer Overview -->

In the following diagram, You can see how the consumer testing process works - it's the same as the current Pact process.

When we call "can-i-deploy" the cross-contract validation process kicks off on Pactflow, to ensure any consumer consumes a valid subset of the OAS for the provider.

![Consumer Test](docs/consumer-scope.png "Consumer Test")


The project uses a Makefile to simulate a very simple build pipeline with two stages - test and deploy.

When you run the CI pipeline (see below for doing this), the pipeline should perform the following activities (simplified):

* Test
  * Run tests (including the pact tests that generate the contract)
  * Publish pacts, tagging the consumer version with the name of the current branch
  * Check if we are safe to deploy to Production with `can-i-deploy` (ie. has the cross-contract validation has been successfully performed)
* Deploy (only from <main|master>)
  * Deploy app to Production
  * Record the Production deployment in the Pact Broker

![Consumer Pipeline](docs./../docs/consumer-pipeline.png "Consumer Pipeline")

<!-- Provider Overview -->

In the following diagram, you can see how the provider testing process works.

When we call "can-i-deploy" the cross-contract validation process kicks off on Pactflow, to ensure any consumer consumes a valid subset of the OAS for the provider.

![Provider Test](docs/provider-scope.png "Provider Test")

The project uses a Makefile to simulate a very simple build pipeline with two stages - test and deploy.

When you run the CI pipeline (see below for doing this), the pipeline should perform the following activities (simplified):

* Test
  * Run tests to check spec compliance with openAPI spec
  * Create branch tag via Pact CLI
  * Publish openAPI spec, along with a version with the name of the current branch
  * Check if we are safe to deploy to Production with `can-i-deploy` (ie. has the cross-contract validation has been successfully performed)
* Deploy (only from <main|master>)
  * Deploy app to Production
  * Record the Production deployment in the Pact Broker
  * 

![Provider Pipeline](docs/provider-pipeline.png "Provider Pipeline")


## Compatibile with <Consumers|Providers>

<!-- Consumer Compatability -->

This project is currently compatible with the following consumers(s):

* [pactflow-example-bi-directional-consumer-nock](https://github.com/pactflow/example-bi-directional-consumer-nock)
* [pactflow-example-bi-directional-consumer-msw](https://github.com/pactflow/example-bi-directional-consumer-msw)
* [pactflow-example-bi-directional-consumer-wiremock](https://github.com/pactflow/example-bi-directional-consumer-wiremock)
* [pactflow-example-bi-directional-consumer-mountebank](https://github.com/pactflow/example-bi-directional-consumer-mountebank)
<!-- * [pactflow-example-bi-directional-consumer-dotnet](https://github.com/pactflow/example-bi-directional-consumer-dotnet) -->

See [Environment variables](#environment-variables) on how to set these up
  

<!-- Provider Compatability -->

This project is currently compatible with the following provider(s):

* [pactflow-example-bi-directional-provider-dredd](https://github.com/pactflow/example-bi-directional-provider-dredd)
* [pactflow-example-bi-directional-provider-restassured](https://github.com/pactflow/example-provider-restassured)
* [pactflow-example-bi-directional-provider-postman](https://github.com/pactflow/example-bi-directional-provider-postman)
* [pactflow-example-bi-directional-provider-dotnet](https://github.com/pactflow/example-bi-directional-provider-dotnet)

See [Environment variables](#environment-variables) on how to set these up.
  
## Pre-requisites

**Software**:

- Tools listed at: https://docs.pactflow.io/docs/workshops/ci-cd/set-up-ci/prerequisites/
- A pactflow.io account with an valid [API token](https://docs.pactflow.io/docs/getting-started/#configuring-your-api-token)

### Environment variables

To be able to run some of the commands locally, you will need to export the following environment variables into your shell:

- `PACT_BROKER_TOKEN`: a valid [API token](https://docs.pactflow.io/docs/getting-started/#configuring-your-api-token) for Pactflow
- `PACT_BROKER_BASE_URL`: a fully qualified domain name with protocol to your pact broker e.g. https://testdemo.pactflow.io

<!-- CONSUMER env vars -->

Set `PACT_PROVIDER` to one of the following

- `PACT_PROVIDER=pactflow-example-bi-directional-provider-dredd`: Dredd - (https://github.com/pactflow/example-bi-directional-provider-dredd)
- `PACT_PROVIDER=pactflow-example-bi-directional-provider-postman`: Postman - (https://github.com/pactflow/example-bi-directional-provider-postman)
- `PACT_PROVIDER=pactflow-example-bi-directional-provider-restassured`:  Rest Assured - (https://github.com/pactflow/example-bi-directional-provider-restassured)
  
## Usage

### Steps

1. Create x
2. Publish x
3. Verify x

### Use case with <Tool>

* `make test` - run the tests locally
* `make fake_ci` - run the CI process, but locally

## OS/Platform specific considerations

The makefile is configured to run on Unix based systems such as you would find in most common CI/CD pipelines. 

They can be run locally on Unix/Mac, or on Windows via [WSL2](https://docs.microsoft.com/en-us/windows/wsl/install). 

### Windows 

You can still try this example locally on Windows using powershell and running commands manually. 

<details>
  <summary>Click to see windows specific instructions here</summary>


  These will be the same commands that are used in the makefile with a few manual tweaks.

1. Make sure you have set all of the environment variables, in powershell they can be set like so.

    ```
     $env:GIT_BRANCH="main"
    ```

  1. Publish the pact that was generated. The step uses the pact-cli docker image to publish the pact to your pactflow account.
  The path for `<path_to_project_root>` needs to be converted from Windows paths to UNIX ones as the Docker container is using UNIX. Either hard code this or set it as another environment variable.

      `C:\Users\Person\Documents\example-bi-directional-consumer-dotnet` 
      
      becomes
      
      `/c/Users/Candy/Documents/Pactflow/example-bi-directional-consumer-dotnet`

      $env:VARIABLE_NAME refers to the environment variables in windows.

      ```
      docker run --rm -v <path_to_project_root>:<path_to_project_root> -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli publish <path_to_pacts_folder> --consumer-app-version $env:GIT_COMMIT --branch $env:GIT_BRANCH

      ```

  4. Check can-i-deploy to see if your provider is compatible with your pact.

      ```
      docker run --rm -v <path_to_project_root>:<path_to_project_root> -e PACT_BROKER_BASE_URL -e PACT_BROKER_TOKEN pactfoundation/pact-cli  broker can-i-deploy --pacticipant pactflow-example-bi-directional-consumer-dotnet --version $env:GIT_COMMIT --to-environment production  --retry-while-unknown 0 --retry-interval 10
      ```

5. Have a look at what other commands are available in the Makefile. All of them can be ran locally from Powershell by changing the windows paths to UNIX and replacing the environment variable references. Any variable referenced as `${VARIABLE}` can be changed to `$env:VARIABLE` to reference environment variables in Powershell.

</details>


## Caveats

1. x
2. y
3. z

## Related topics / posts / discussions

- x
- y
- z

## Other examples of how to do this form of testing

- x
- y
- z

## Found an issue?

Reach out via a GitHub Issue, or reach us over in the [Pact foundation Slack](https://slack.pact.io)