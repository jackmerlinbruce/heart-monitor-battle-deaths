document.addEventListener('DOMContentLoaded', () => {

    const w = window.innerWidth
    const h = window.innerHeight / 2
    const padding = 30
    
    const svg = d3.select('body')
        .append('svg')
        .attr('class', 'canvas')
        .attr('width', w)
        .attr('height', h)
    
    function startAnimation(filename) {
        d3.select('.line').remove()

        d3.csv(filename, (error, data) => {

            data.forEach(function (d) {
                d.start_year = +d.start_year
                d.total_deaths = +d.total_deaths
                // console.log(d.start_year, d.total_deaths)
            })

            const x = d3.scaleLinear().range([0, w])
            const y = d3.scaleLinear().range([h - padding, padding])
            x.domain([
                d3.min(data, function (d) { return d.start_year; }),
                d3.max(data, function (d) { return d.start_year; })
            ])
            y.domain([0, d3.max(data, function (d) { return d.total_deaths; })])

            const line = d3.line()
                .curve(d3.curveMonotoneX)
                .x(function (d) { return x(d.start_year); })
                .y(function (d) { return y(d.total_deaths); });

            svg.append("path")
                .data([data])
                .attr("class", "line")
                .attr('id', 'line')
                .attr("d", line);

            console.log(document.getElementById('line').getTotalLength())
        })
    }
    
    const dataChange = document.getElementById('change-data')
    dataChange.addEventListener('change', e => {
        if (dataChange.value === 'raw') {
            startAnimation('./deaths-by-year.csv')
        } else if (dataChange.value === 'cumulative') {
            startAnimation('./deaths-by-year_cumulative.csv')
        }
    })
    startAnimation('./population.csv')
})