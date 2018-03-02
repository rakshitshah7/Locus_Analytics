var colors = d3.scaleOrdinal(d3.schemeCategory10);
var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height"),
    node,
    link;

function onchange() {
    d3.csv("./nodes.csv",function (error, data) {
        var graph = {nodes: data, links: null}
        d3.csv("./edges.csv", function (error, data) {
            graph.links = data;
            var selectValue = d3.select('select').property('value')
            var selectedNode = graph.nodes.filter(function (t) { if(t.label === selectValue) return t; });
            var selectedLink = graph.links.filter(
                function (t)
                { if(t.source == selectedNode[0].id || t.target == selectedNode[0].id )
                    return t;
                }
            );
            svg.selectAll("*").remove();
            svg.append('defs').append('marker')
                .attrs({'id':'arrowhead',
                    'viewBox':'-0 -5 10 10',
                    'refX':13,
                    'refY':0,
                    'orient':'auto',
                    'markerWidth':13,
                    'markerHeight':13,
                    'xoverflow':'visible'})
                .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#999')
                .style('stroke','none');
            update(selectedLink, graph.nodes);
        });
    });

};

svg.append('defs').append('marker')
    .attrs({'id':'arrowhead',
        'viewBox':'-0 -5 10 10',
        'refX':13,
        'refY':0,
        'orient':'auto',
        'markerWidth':13,
        'markerHeight':13,
        'xoverflow':'visible'})
    .append('svg:path')
    .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
    .attr('fill', '#999')
    .style('stroke','none');

var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function (d) {return d.id;}).distance(300).strength(1))
    .force("charge", d3.forceManyBody().strength(-60))
    .force("center", d3.forceCenter(width / 2, height / 2));

d3.csv("./nodes.csv",function (error, data) {
    var optionsData = data.map(function (t) { return t.label; });
    optionsData.sort();
    var select = d3.select('body')
        .append('select')
        .attr('class','select')
        .on('change',onchange)

    var options = select
        .selectAll('option')
        .data(optionsData).enter()
        .append('option')
        .text(function (d) { return d; });
    graph = {nodes : data, links: null}
    d3.csv("./edges.csv", function (error, data){
        graph.links = data;
        var selectValue = d3.select('select').property('value')
        var selectedNode = graph.nodes.filter(function (t) { if(t.label === selectValue) return t; });
        var selectedLink = graph.links.filter(
            function (t)
            { if(t.source == selectedNode[0].id || t.target == selectedNode[0].id )
                return t;
            }
        );
        svg.selectAll("*").remove();
        svg.append('defs').append('marker')
            .attrs({'id':'arrowhead',
                'viewBox':'-0 -5 10 10',
                'refX':13,
                'refY':0,
                'orient':'auto',
                'markerWidth':13,
                'markerHeight':13,
                'xoverflow':'visible'})
            .append('svg:path')
            .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
            .attr('fill', '#999')
            .style('stroke','none');
        update(selectedLink, graph.nodes);
    });
});

function update(links, nodes) {
    link = svg.selectAll(".link")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end','url(#arrowhead)')

    link.append("title")
        .text(function (d) {return d.type;});

    edgepaths = svg.selectAll(".edgepath")
        .data(links)
        .enter()
        .append('path')
        .attrs({
            'class': 'edgepath',
            'fill-opacity': 0,
            'stroke-opacity': 0,
            'id': function (d, i) {return 'edgepath' + i}
        })
        .style("pointer-events", "none");

    edgelabels = svg.selectAll(".edgelabel")
        .data(links)
        .enter()
        .append('text')
        .style("pointer-events", "none")
        .attrs({
            'class': 'edgelabel',
            'id': function (d, i) {return 'edgelabel' + i},
            'font-size': 10,
            'fill': '#aaa'
        });

    edgelabels.append('textPath')
        .attr('xlink:href', function (d, i) {return '#edgepath' + i})
        .style("text-anchor", "middle")
        .style("pointer-events", "none")
        .attr("startOffset", "50%")
        .text(function (d) {return d.label});

    node = svg.selectAll(".node")
        .data(nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
            //.on("end", dragended)
        );

    node.append("circle")
        .attr("r", 5)
        .style("fill", function (d) {return colors(d.Object);})

    node.append("title")
        .text(function (d) {return 'Object ' + d.Object+ ' |Activity ' + d.Activity ;});
    node.append("text")
        .attr("dy", -3)
        .text(function (d) {return d.label;});


    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);
}

function ticked() {
    link
        .attr("x1", function (d) {return d.source.x;})
        .attr("y1", function (d) {return d.source.y;})
        .attr("x2", function (d) {return d.target.x;})
        .attr("y2", function (d) {return d.target.y;});

    node
        .attr("transform", function (d) {return "translate(" + d.x + ", " + d.y + ")";});

    edgepaths.attr('d', function (d) {
        return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y;
    });

    edgelabels.attr('transform', function (d) {
        if (d.target.x < d.source.x) {
            var bbox = this.getBBox();

            rx = bbox.x + bbox.width / 2;
            ry = bbox.y + bbox.height / 2;
            return 'rotate(180 ' + rx + ' ' + ry + ')';
        }
        else {
            return 'rotate(0)';
        }
    });
}

function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
}