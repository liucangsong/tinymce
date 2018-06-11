import * as Behaviour from 'ephox/alloy/api/behaviour/Behaviour';
import { Representing } from 'ephox/alloy/api/behaviour/Representing';
import * as GuiFactory from 'ephox/alloy/api/component/GuiFactory';
import * as RepresentPipes from 'ephox/alloy/test/behaviour/RepresentPipes';
import * as GuiSetup from 'ephox/alloy/test/GuiSetup';
import { UnitTest } from '@ephox/bedrock';

UnitTest.asynctest('RepresentingTest (mode: memory)', function () {
  const success = arguments[arguments.length - 2];
  const failure = arguments[arguments.length - 1];

  GuiSetup.setup(function (store, doc, body) {
    return GuiFactory.build({
      dom: {
        tag: 'span'
      },
      behaviours: Behaviour.derive([
        Representing.config({
          store: {
            mode: 'memory',
            initialValue: '1'
          }
        })
      ])
    });

  }, function (doc, body, gui, component, store) {
    return [
      RepresentPipes.sAssertValue('Checking initial value', '1', component),
      RepresentPipes.sSetValue(component, '2'),
      RepresentPipes.sAssertValue('Checking 2nd value', '2', component)
    ];
  }, function () { success(); }, failure);
});