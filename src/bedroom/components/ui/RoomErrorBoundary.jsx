import { Component } from "react";

// If WebGL is unavailable or a model/texture fails to load, show a short
// message instead of a blank page; the Skip button outside stays usable.
class RoomErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <div className="bedroom-error">
          <p>The 3D room couldn&apos;t load on this device.</p>
          <p>Use &ldquo;Skip to desktop&rdquo; to continue.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

export default RoomErrorBoundary;
