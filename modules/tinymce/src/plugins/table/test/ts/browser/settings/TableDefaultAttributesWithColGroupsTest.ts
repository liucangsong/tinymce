import { ApproxStructure, GeneralSteps, Log, Pipeline, Waiter } from '@ephox/agar';
import { UnitTest } from '@ephox/bedrock-client';
import { TinyApis, TinyLoader, TinyUi } from '@ephox/mcagar';
import TablePlugin from 'tinymce/plugins/table/Plugin';
import SilverTheme from 'tinymce/themes/silver/Theme';
import * as TableTestUtils from '../../module/test/TableTestUtils';

/* This requires a menubar. Cannot migrate yet. */
UnitTest.asynctest('browser.tinymce.plugins.table.TableDefaultAttributesWithColGroupsTest', (success, failure) => {
  TablePlugin();
  SilverTheme();

  TinyLoader.setup((editor, onSuccess, onFailure) => {
    const tinyApis = TinyApis(editor);
    const tinyUi = TinyUi(editor);

    const createTableChildren = (s: ApproxStructure.StructApi, str: ApproxStructure.StringApi) =>
      [
        s.element('colgroup', {
          children: [
            s.element('col', {
              styles: {
                width: str.contains('%')
              }
            }),
            s.element('col', {
              styles: {
                width: str.contains('%')
              }
            })
          ]
        }),
        s.element('tbody', {
          children: [
            s.element('tr', {
              children: [
                s.element('td', {
                  styles: {
                    width: str.none()
                  },
                  children: [
                    s.element('br', {})
                  ]
                }),
                s.element('td', {
                  styles: {
                    width: str.none()
                  },
                  children: [
                    s.element('br', {})
                  ]
                })
              ]
            }),
            s.element('tr', {
              children: [
                s.element('td', {
                  styles: {
                    width: str.none()
                  },
                  children: [
                    s.element('br', {})
                  ]
                }),
                s.element('td', {
                  styles: {
                    width: str.none()
                  },
                  children: [
                    s.element('br', {})
                  ]
                })
              ]
            })
          ]
        })
      ];

    Pipeline.async({}, [
      Log.step('TINY-6050', 'no attributes without setting', GeneralSteps.sequence([
        tinyApis.sFocus(),
        tinyUi.sClickOnMenu('click table menu', 'span:contains("Table")'),
        Waiter.sTryUntil('click table menu', tinyUi.sClickOnUi('click table menu', 'div.tox-menu div.tox-collection__item .tox-collection__item-label:contains("Table")')),
        Waiter.sTryUntil('click table grid', tinyUi.sClickOnUi('click table grid', 'div.tox-insert-table-picker div[role="button"]:nth(11)')), // button for 2x2 table
        TableTestUtils.sAssertTableStructure(editor, ApproxStructure.build((s, str) =>
          s.element('table', {
            styles: {
              'width': str.is('100%'),
              'border-collapse': str.is('collapse')
            },
            attrs: {
              border: str.is('1')
            },
            children: createTableChildren(s, str)
          })
        )),
        tinyApis.sSetContent('')
      ])),

      Log.step('TINY-6050', 'test default title attribute', GeneralSteps.sequence([
        tinyApis.sFocus(),
        tinyApis.sSetSetting('table_default_attributes', { title: 'x' }),
        tinyUi.sClickOnMenu('click table menu', 'span:contains("Table")'),
        Waiter.sTryUntil('click table menu', tinyUi.sClickOnUi('click table menu', 'div.tox-menu div.tox-collection__item .tox-collection__item-label:contains("Table")'), 10, 1000),
        Waiter.sTryUntil('click table grid', tinyUi.sClickOnUi('click table grid', 'div.tox-insert-table-picker div[role="button"]:nth(11)'), 10, 1000), // button for 2x2 table
        TableTestUtils.sAssertTableStructure(editor, ApproxStructure.build((s, str) =>
          s.element('table', {
            styles: {
              'width': str.is('100%'),
              'border-collapse': str.is('collapse')
            },
            attrs: {
              border: str.none('Should not have the default border'),
              title: str.is('x')
            },
            children: createTableChildren(s, str)
          })
        )),
        tinyApis.sSetContent('')
      ]))
    ], onSuccess, onFailure);
  }, {
    indent: false,
    plugins: 'table',
    theme: 'silver',
    base_url: '/project/tinymce/js/tinymce',
    statusbar: false,
    table_use_colgroups: true
  }, success, failure);
});
