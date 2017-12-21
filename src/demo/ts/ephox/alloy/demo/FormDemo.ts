import Behaviour from 'ephox/alloy/api/behaviour/Behaviour';
import Keying from 'ephox/alloy/api/behaviour/Keying';
import Representing from 'ephox/alloy/api/behaviour/Representing';
import Tabstopping from 'ephox/alloy/api/behaviour/Tabstopping';
import Attachment from 'ephox/alloy/api/system/Attachment';
import Gui from 'ephox/alloy/api/system/Gui';
import Button from 'ephox/alloy/api/ui/Button';
import Container from 'ephox/alloy/api/ui/Container';
import ExpandableForm from 'ephox/alloy/api/ui/ExpandableForm';
import Form from 'ephox/alloy/api/ui/Form';
import DemoDataset from 'ephox/alloy/demo/DemoDataset';
import DemoSink from 'ephox/alloy/demo/DemoSink';
import DemoFields from './forms/DemoFields';
import HtmlDisplay from 'ephox/alloy/demo/HtmlDisplay';
import { Obj } from '@ephox/katamari';
import { Result } from '@ephox/katamari';
import { Element } from '@ephox/sugar';
import { Class } from '@ephox/sugar';



export default <any> function () {
  var gui = Gui.create();
  var body = Element.fromDom(document.body);
  Class.add(gui.element(), 'gui-root-demo-container');
  Attachment.attachSystem(body, gui);

  var sink = DemoSink.make();

  gui.add(sink);

  var lazySink = function () {
    return Result.value(sink);
  };

  var alphaSpec = { label: 'Alpha', inline: false };
  var betaSpec = { label: 'Beta', inline: false };
  var gammaSpec = { label: 'Gamma', inline: true };
  var deltaSpec = { label: 'Delta', inline: false };
  var epsilonSpec = { label: 'Epsilon' };


  var thetaSpec = {
    label: 'AA',
    options: [
      { value: 'a.a', text: 'A.A' },
      { value: 'b.b', text: 'B.B' },
      { value: 'c.c', text: 'C.C' },
      { value: 'd.d', text: 'D.D' }
    ]
  };

  var rhoSpec = {
    legend: 'Rho',
    choices: [
      { value: 'left', text: 'Left' },
      { value: 'middle', text: 'Middle' },
      { value: 'right', text: 'Right' }
    ]
  };

  var omegaSpec = {
    field1: { label: 'omega-1', inline: false },
    field2: { label: 'omega-2', inline: false }
  };

  var maxiSpec = {
    label: 'Maxis',
    dataset: DemoDataset,
    lazySink: lazySink
  };

  var form = HtmlDisplay.section(
    gui,
    'This form has many fields',
    Form.sketch(function (parts) {
      return {
        dom: {
          tag: 'div',
          classes: [ 'outside-form' ]
        },

        components: [
          parts.field('alpha', DemoFields.textMunger(alphaSpec)),
          parts.field('beta', DemoFields.textMunger(betaSpec)),
          Container.sketch({
            dom: {
              styles: {
                border: '1px solid green'
              }
            },
            components: [
              parts.field('gamma', DemoFields.textMunger(gammaSpec))
            ]
          }),

          parts.field('delta', DemoFields.textMunger(deltaSpec)),
          parts.field('epsilon', DemoFields.textMunger(epsilonSpec)),
          parts.field('theta', DemoFields.selectMunger(thetaSpec)),
          parts.field('rho', DemoFields.chooserMunger(rhoSpec)),
          parts.field('omega', DemoFields.coupledTextMunger(omegaSpec)),
          parts.field('maxis', DemoFields.typeaheadMunger(maxiSpec)),

          Button.sketch({
            dom: {
              tag: 'button',
              innerHtml: 'OK'
            },
            action: function (button) {
              console.log('Form values', Obj.map(
                Representing.getValue(form),
                function (v) {
                  return v.getOr('Not found');
                }
              ));
            }
          })
        ],

        formBehaviours: Behaviour.derive([
          Keying.config({
            mode: 'cyclic'
          })
        ])
      };
    })
  );

  Representing.setValue(form, {
    alpha: 'doggy',
    beta: 'bottle',
    gamma: 'cad'
  });

  var expform = HtmlDisplay.section(
    gui,
    'This form expands',
    ExpandableForm.sketch({
      dom: {
        tag: 'div',
        classes: [ 'expandable-form' ]
      },

      markers: {
        expandedClass: 'a',
        collapsedClass: 'b',
        closedClass: 'demo-sliding-closed',
        openClass: 'demo-sliding-open',
        shrinkingClass: 'demo-sliding-height-shrinking',
        growingClass: 'demo-sliding-height-growing'
      },

      components: [
        ExpandableForm.parts().minimal(
          Form.sketch(function (parts) {
            return {
              dom: {
                tag: 'div',
                classes: [ 'form-section' ]
              },

              components: [
                parts.field('omega', DemoFields.coupledTextMunger(omegaSpec)),
                parts.field('alpha', DemoFields.textMunger(alphaSpec)),
                parts.field('beta', DemoFields.textMunger(betaSpec)),
              ]
            };
          })
        ),

        ExpandableForm.parts().extra(
          Form.sketch(function (parts) {
            return {
              dom: {
                tag: 'div',
                classes: [ 'form-section' ]
              },
              components: [
                parts.field('beta', DemoFields.textMunger(betaSpec)),
                Container.sketch({
                  dom: {
                    styles: {
                      border: '1px solid green'
                    }
                  },
                  components: [
                    parts.field('gamma', DemoFields.textMunger(gammaSpec))
                  ]
                }),
                parts.field('delta', DemoFields.textMunger(deltaSpec)),
                parts.field('epsilon', DemoFields.textMunger(epsilonSpec)),
                parts.field('rho', DemoFields.chooserMunger(rhoSpec))    
              ]
            };
          })
        ),
        ExpandableForm.parts().expander({
          dom: {
            tag: 'button',
            innerHtml: 'v'
          },
          buttonBehaviours: Behaviour.derive([
            Tabstopping.config({ })
          ])
        }),
        ExpandableForm.parts().controls({
          dom: {
            tag: 'div'
          },
          behaviours: Behaviour.derive([
            Tabstopping.config({ }),
            Keying.config({
              mode: 'flow',
              selector: 'button'
            })
          ]),
          components: [
            Button.sketch(
              {
                dom: { tag: 'button', innerHtml: 'OK' },
                action: function (button) {
                  console.log('Exp Form values', Obj.map(
                    Representing.getValue(expform),
                    function (v) {
                      return v.getOr('Not found');
                    }
                  ));
                }
              }
            )
          ]
        })
      ],
      expandableBehaviours: Behaviour.derive([
        Keying.config({
          mode: 'cyclic',
          visibilitySelector: '.form-section'
        })
      ])
    })
  );

  Keying.focusIn(expform);

  setTimeout(function () {
    ExpandableForm.toggleForm(expform);

    Representing.setValue(form, {
      alpha: 'hi'
    });

    console.log('form', Obj.map(Representing.getValue(form), function (v) { return v.getOrDie(); }));

    console.log('expform', Obj.map(Representing.getValue(expform), function (v) { return v.getOrDie(); }));

    Representing.setValue(expform, {
      'omega': 'hi'
    });

    Representing.getValue(expform);

  }, 100);
};