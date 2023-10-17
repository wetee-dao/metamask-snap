/* eslint-disable jsdoc/require-jsdoc */
export function convertToSVG(base64: string) {
  // Decode the base64 image using atob
  const binary = atob(base64);

  // Parse the binary string as an XML document
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(binary, 'text/xml');

  // Create an SVG element from the XML document
  const svgElement = xmlDoc.documentElement;

  // Modify the attributes and styles of the SVG element
  // Set the width and height attributes
  svgElement.setAttribute('width', '13');
  svgElement.setAttribute('height', '13');
  // Set the fill and stroke colors and widths
  svgElement.querySelector('.cls-1').style.stroke = '#000';
  svgElement.querySelector('.cls-1').style.strokeWidth = '1';
  svgElement.querySelector('.cls-2').style.fill = '#fff';
  // Set other attributes and styles as needed

  // Serialize the SVG element to a string
  const serializer = new XMLSerializer();
  const xmlString = serializer.serializeToString(svgElement);

  // Return the XML string as the output
  return xmlString;
}
