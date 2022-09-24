// dataset.js
import { Dataset } from "crawlee";

const dataset = await Dataset.open();

const { items } = await dataset.getData();
console.log(items.length);
