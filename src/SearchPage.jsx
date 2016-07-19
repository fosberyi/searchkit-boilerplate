import * as React from 'react';
import * as _ from 'lodash';

import {
  ActionBar,
  ActionBarRow,
  Hits,
  HitsStats,
  ItemHistogramList,
  Layout,
  LayoutBody,
  LayoutResults,
  MenuFilter,
  NoHits,
  Pagination,
  RefinementListFilter,
  ResetFilters,
  SearchBox,
  SearchkitManager,
  SearchkitProvider,
  SelectedFilters,
  SideBar,
  SortingSelector,
  TopBar
} from 'searchkit';

require('./index.scss');

const host = 'https://es-2923778433.us-west-2.bonsai.io'
const searchkit = new SearchkitManager(host, {
  basicAuth: 'uc1zelyuov:sps00khygg'
})

const MovieHitsGridItem = (props) => {
  const {bemBlocks, result} = props
  let url = 'http://www.imdb.com/title/' + result._source.imdbId
  const source:any = _.extend({}, result._source, result.highlight)
  return (
    <div className={bemBlocks.item().mix(bemBlocks.container('item'))} data-qa='hit'>
      <div data-qa='title' className={bemBlocks.item('title')} dangerouslySetInnerHTML={{__html:source.title.title}}></div>
      <div data-qa='description' className={bemBlocks.item('description')} dangerouslySetInnerHTML={{__html:source.description.shortDescription}}></div>
    </div>
  )
}

export class SearchPage extends React.Component {
  render(){
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <SearchBox
              autofocus={true}
              searchOnChange={true}
              placeholder='Search movies...'
              prefixQueryFields={['description.longDescription^1', 'tags^1', 'type^2', 'title^10']}/>
          </TopBar>
          <LayoutBody>
            <SideBar>
              <RefinementListFilter
                id='tags'
                title='Tags'
                field='tags.raw'
                operator='AND'
                size={10}/>
            </SideBar>
            <LayoutResults>
              <ActionBar>
                <ActionBarRow>
                  <HitsStats/>
                  <SortingSelector options={[
                    {label:'Relevance', field:'_score', order:'desc', defaultOption:true},
                    {label:'Latest Releases', field:'created', order:'desc'},
                    {label:'Earliest Releases', field:'created', order:'asc'}
                  ]}/>
                </ActionBarRow>
                <ActionBarRow>
                  <SelectedFilters/>
                  <ResetFilters/>
                </ActionBarRow>
              </ActionBar>
              <Hits mod='sk-hits-grid' hitsPerPage={10} itemComponent={MovieHitsGridItem}
                sourceFilter={['title', 'description.shortDescription']}/>
              <NoHits/>
              <Pagination showNumbers={true}/>
            </LayoutResults>
          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    )
  }
}
