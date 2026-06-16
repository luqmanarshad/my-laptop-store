const fs = require('fs');
const path = require('path');

const filesToUpdate = [
    'resources/js/Pages/Cart.vue',
    'resources/js/Pages/AdminOrders.vue',
    'resources/js/Pages/Dashboard.vue',
    'resources/js/Pages/ProductDetails.vue',
    'resources/js/Pages/Laptops.vue',
    'resources/js/Pages/Home.vue',
    'resources/js/Pages/Deals.vue',
    'resources/js/Components/ProductCard.vue', // if exists
];

filesToUpdate.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        // Replace ${something} but KEEP template literals working (wait, Vue uses {{ }})
        // In Vue templates: ${{ price }} -> Rs. {{ price }}
        content = content.replace(/\$\{\{/g, 'Rs. {{');
        
        // In strings/labels: Price ($) -> Price (Rs.)
        content = content.replace(/Price \(\$\)/g, 'Price (Rs.)');
        content = content.replace(/Sale Price \(\$\)/g, 'Sale Price (Rs.)');

        // Other generic $ replacements (careful not to break JS template literals like `${var}`)
        // If it's a dollar sign immediately before a number or Vue tag:
        // $ {{ -> Rs. {{
        content = content.replace(/\$ \{\{/g, 'Rs. {{');
        // $product -> we don't want to replace this. 
        // >$ -> >Rs.
        // > $< -> > Rs. <
        
        fs.writeFileSync(fullPath, content);
        console.log('Updated ' + file);
    }
});
