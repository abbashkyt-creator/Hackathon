const _origRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function(child) {
  if (child && child.parentNode === this) {
    return _origRemoveChild.call(this, child);
  }
  return child;
};
