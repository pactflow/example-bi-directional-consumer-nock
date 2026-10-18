import { Component, type ReactNode } from "react";
import { Heading } from "./Heading.tsx";
import { Layout } from "./Layout.tsx";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// React offers no hook equivalent of componentDidCatch, so error
// boundaries remain class components.
export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  componentDidCatch() {
    this.setState({ hasError: true });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <Heading text="Sad times :(" href="/" />
          <div className="columns">
            <img
              className="column col-6"
              style={{
                height: "100%",
              }}
              src="/sad_panda.gif"
              alt="sad_panda"
            />
            <pre
              className="code column col-6"
              style={{
                wordWrap: "break-word",
              }}
            />
          </div>
        </Layout>
      );
    }
    return this.props.children;
  }
}
