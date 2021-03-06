var select = require('xpath.js');

function findAttr(node, localName, namespace) {
  try{
    var length = node.attributes.length;
  }catch(err){
    // Error Handling
  }
  for (var i = 0; i<length; i++) {
    try{
      var attr = node.attributes[i]
    }catch(err){
      // Error Handling
    }

  	if (attrEqualsExplicitly(attr, localName, namespace) || attrEqualsImplicitly(attr, localName, namespace, node)) {  		  	
  		return attr
  	}
  }
  return null
}

function findFirst(doc, xpath) {  
  var nodes = select(doc, xpath)    
  if (nodes.length==0) throw "could not find xpath " + xpath
  return nodes[0]
}

function findChilds(node, localName, namespace) {
  try{
    node = node.documentElement || node;
  }catch(err){
    // Error Handling
  }
  var res = []
  for (var i = 0; i<node.childNodes.length; i++) {
    var child = node.childNodes[i]       
    if (child.localName==localName && (child.namespaceURI==namespace || !namespace)) {
      res.push(child)
    }
  }
  return res
}

function attrEqualsExplicitly(attr, localName, namespace) {
	return attr.localName==localName && (attr.namespaceURI==namespace || !namespace)
}

function attrEqualsImplicitly(attr, localName, namespace, node) {
	return attr.localName==localName && ((!attr.namespaceURI && node.namespaceURI==namespace) || !namespace)
}

var xml_special_to_encoded_attribute = {
    '&': '&amp;',
    '<': '&lt;',
    '"': '&quot;',
    '\r': '&#xD;',
    '\n': '&#xA;',
    '\t': '&#x9;'
}

var xml_special_to_encoded_text = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '\r': '&#xD;'
}

function encodeSpecialCharactersInAttribute(attributeValue){
    return attributeValue
        .replace(/[\r\n\t ]+/g, ' ') // White space normalization (Note: this should normally be done by the xml parser) See: https://www.w3.org/TR/xml/#AVNormalize
        .replace(/([&<"\r\n\t])/g, function(str, item){
            // Special character normalization. See:
            // - https://www.w3.org/TR/xml-c14n#ProcessingModel (Attribute Nodes)
            // - https://www.w3.org/TR/xml-c14n#Example-Chars
            return xml_special_to_encoded_attribute[item]
        })
}

function encodeSpecialCharactersInText(text){
    return text
        .replace(/\r\n?/g, '\n')  // Line ending normalization (Note: this should normally be done by the xml parser). See: https://www.w3.org/TR/xml/#sec-line-ends
        .replace(/([&<>\r])/g, function(str, item){
            // Special character normalization. See:
            // - https://www.w3.org/TR/xml-c14n#ProcessingModel (Text Nodes)
            // - https://www.w3.org/TR/xml-c14n#Example-Chars
            return xml_special_to_encoded_text[item]
        })
}


exports.findAttr = findAttr
exports.findChilds = findChilds
exports.encodeSpecialCharactersInAttribute = encodeSpecialCharactersInAttribute
exports.encodeSpecialCharactersInText = encodeSpecialCharactersInText
exports.findFirst = findFirst
