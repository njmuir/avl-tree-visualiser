// File: tree.js

// Spacing between levels
const VERTICAL_SPACING = 150;
// Spacing between the root node and the top of the screen 
const VERTICAL_OFFSET = 90;
// Delay between visualising actions
const WAIT_TIME = 1000;

const NODE_RADIUS = 40;

// Represents an AVL tree node
class Node {
    constructor(key) {
        this.key = key;
        this.left = null;
        this.right = null;
        this.parent = null;
        // this.height = 1;
    }

    // Gives the node's in-order succesor
    succesor() {
        if (!this.right) {
            return null;
        }

        let itr = this.right;
        while (itr.left) {
            itr = itr.left;
        }
        return itr;
    }
}

// Utility function to calculate the height of a node
function height(node) {
    if (!node) {
        return 0;
    }
    return 1 + Math.max(height(node.left), height(node.right));
}

// Utility function to calculate the balance factor of a node
function balanceFactor(node) {
    if (!node) {
        return 0;
    }
    return height(node.left) - height(node.right);
}

// Represents an AVL tree
class Tree {
    constructor() {
        this.root = null;
    }

    // Inserts a key into the tree
    async insert(key) {
        if (!this.root) {
            this.root = new Node(key);
            this.visualise();
            await sleep(WAIT_TIME);
        } else {
            await this._recurInsert(this.root, key);
        }
    }

    // Helper function for insertion
    async _recurInsert(node, key) {
        if (key < node.key) {
            if (!node.left) {
                // Found the correct spot
                node.left = new Node(key);
                node.left.parent = node;
                this.visualise();
                await sleep(WAIT_TIME);
            } else {
                await this._recurInsert(node.left, key);
            }
        } else if (key > node.key) {
            if (!node.right) {
                // Found the correct spot
                node.right = new Node(key);
                node.right.parent = node;
                this.visualise();
                await sleep(WAIT_TIME);
            } else {
                await this._recurInsert(node.right, key);
            }
        } else {
            alert(key + " is already in the tree");
            return;
        }

        await this._balanceNode(node);
    }

    // Deletes a key from the tree
    async remove(key) {
        await this._recurRemove(this.root, key);
    }

    // Helper function for deletion
    async _recurRemove(node, key) {
        if (!node) {
            alert(key + " is not in the tree");
            return;
        }

        if (key < node.key) {
            await this._recurRemove(node.left, key);
        } else if (key > node.key) {
            await this._recurRemove(node.right, key);
        } else {
            // Found the node to delete
            if (!node.left && !node.right) {
                // No children so just delete
                if (!node.parent) {
                    // Removing the root
                    this.root = null;
                } else if (node == node.parent.right) {
                    node.parent.right = null;
                } else {
                    node.parent.left = null;
                }
                this.visualise();
                await sleep(WAIT_TIME);
            } else if (!node.right) {
                // Swap with left child and then delete
                const tmp = node.key;
                node.key = node.left.key;
                node.left.key = tmp;
                this.visualise();
                await sleep(WAIT_TIME);
                node.left = null;
                this.visualise();
                await sleep(WAIT_TIME);
            } else if (!node.left) {
                // Swap with right child and then delete
                const tmp = node.key;
                node.key = node.right.key;
                node.right.key = tmp;
                this.visualise();
                await sleep(WAIT_TIME);
                node.right = null;
                this.visualise();
                await sleep(WAIT_TIME);   
            } else {
                // Swap with in-order succesor and then delete 
                const succesor = node.succesor();
                const tmp = node.key;
                node.key = succesor.key;
                succesor.key = tmp;
                this.visualise();
                await sleep(WAIT_TIME);
                await this._recurRemove(node.right, tmp);
            }
        }

        await this._balanceNode(node);
    }

    // Balances a given node
    async _balanceNode(node) {
        const bf = balanceFactor(node);
        if (bf > 1) {
            if (balanceFactor(node.left) < 0) {
                await this._leftRotate(node.left);
                await this._rightRotate(node);
                
            } else {
                await this._rightRotate(node);
            }
        } else if (bf < -1) {
            if (balanceFactor(node.right) > 0) {
                await this._rightRotate(node.right);
                await this._leftRotate(node);
            } else {
                await this._leftRotate(node);
            }
        }

    } 

    // Performs a left rotation on a given node
    async _leftRotate(x) {
        const y = x.right;
        x.right = y.left;
        if (y.left) {
            y.left.parent = x;
        } 
        y.parent = x.parent;
        if (!y.parent) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }
        y.left = x;
        x.parent = y;
        this.visualise();
        await sleep(WAIT_TIME);
    }

    // Performs a left rotation on a given node
    async _rightRotate(y) {
        const x = y.left;
        y.left = x.right;
        if (x.right) {
            x.right.parent = y;
        } 
        x.parent = y.parent;
        if (!x.parent) {
            this.root = x;
        } else if (y === y.parent.right) {
            y.parent.right = x;
        } else {
            y.parent.left = x;
        }
        x.right = y;
        y.parent = x;
        this.visualise();
        await sleep(WAIT_TIME);
    }

     // Visualises the tree
     async visualise() {
        document.getElementById('tree-container').innerHTML = '';
        if (this.root) {
            this._recurVisualise(this.root, 0, 0);
        }
    }

    // Helper function for visualistion
    _recurVisualise(node, depth, i, parentX, parentY) {
        if (!node) {
            return;
        }

        // Draw the node
        const nodeElem = document.createElement('div');
        nodeElem.className = 'node';
        const spacing = SCREEN_WIDTH / (2**depth + 1);
        const x = (i + 1) * spacing;
        const y = VERTICAL_OFFSET + depth * VERTICAL_SPACING;
        // const radius = parseFloat(getComputedStyle(nodeElem).getPropertyValue("--diameter")) / 2;
        // console.log(radius);
        nodeElem.style.left = `${x-NODE_RADIUS}px`;
        nodeElem.style.top = `${y-NODE_RADIUS}px`;
        nodeElem.textContent = node.key;
        document.getElementById('tree-container').appendChild(nodeElem);
        
        // Draw its children
        this._recurVisualise(node.left, depth+1, 2*i, x, y);
        this._recurVisualise(node.right, depth+1, 2*i+1, x, y);


        if (depth == 0) {
            return;
        }

        // Draw a line to its parent
        const lineElem = document.createElement('div');
        lineElem.className = 'line';
        const length = Math.sqrt((parentX - x)**2 + (parentY - y)**2);
        const angle = Math.atan2(y - parentY, x - parentX) * (180 / Math.PI);
        lineElem.style.width = `${length}px`;
        lineElem.style.transform = `rotate(${angle}deg)`;
        lineElem.style.left = `${parentX}px`;
        lineElem.style.top = `${parentY}px`;
        lineElem.style.position = 'absolute';
        lineElem.style.transformOrigin = '0% 50%';
        document.getElementById('tree-container').appendChild(lineElem);
    }   

    // Returns a copy of the tree
    copy() {
        const copy = new Tree();
        if (this.root) {
            copy.root = this._recurCopy(this.root, copy);
        }
        return copy;
    }

    // Helper function for copying
    _recurCopy(original, copy) {
        if(!original) {
            return null;
        }

        copy = new Node(original.key);

        copy.left = this._recurCopy(original.left, copy.left);
        if (copy.left) {
            copy.left.parent = copy;
        }

        copy.right = this._recurCopy(original.right, copy.right);
        if (copy.right) {
            copy.right.parent = copy;
        }

        return copy;
    }
}





